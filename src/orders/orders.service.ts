import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Decimal } from 'decimal.js';


@Injectable()
export class OrdersService {


  constructor(private readonly prisma: PrismaService) { }

  async create(userId: number, dto: CreateOrderDto) {

    // extracting the product ids
    const productIds = dto.items.map((item) => item.productId)

    const uniqueProductId = new Set(productIds)

    if (uniqueProductId.size != productIds.length) {
      throw new BadRequestException('Each product can appear only once in an order.')
    }


    try {

      let isOrderCreated = await this.prisma.$transaction(async (t) => {
        let products = await t.product.findMany({
          where: {
            id: {
              in: productIds
            },
            stock: {
              gte: 1
            }
          },
        })

        if (products.length != uniqueProductId.size) {
          throw new NotFoundException('One or more products do not exist. Or else stock out!')
        }
        let total = new Decimal(0);
        const productMap = new Map(products.map((product) => [product.id, product]))



        const orderItems = dto.items.map((item) => {

          let product = productMap.get(item.productId);
          if (!product) {
            throw new NotFoundException(`Product with ID ${item.productId} not found`);
          }
          total = total.plus(product?.price).mul(item.quantity);
          return {
            productId: item.productId,
            unitPrice: product?.price,
            quantity: item.quantity,
          }
        })

        const order = await t.order.create({
          data: {
            userId,
            total_amount: total,
            status: dto.paymentMethod == "COD" ? "processing" : "pending"
          },
        })

        // STOCK DECREMENT
        for (const item of dto.items) {
          let result = await t.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity }
            },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          })
          if (result.count != 1) {
            throw new ConflictException(`Insufficient stock for product id ${item.productId}.`)
          }
        }

        // order items inserted 
        await t.orderItems.createMany({
          data: orderItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            unitPrice: item.unitPrice,
            quantity: item.quantity
          }))
        })

        return await t.order.findUnique({
          where: {
            id: order.id,
          },
          select: {
            total_amount: true,
            orderItems: {
              select: {
                unitPrice: true,
                quantity: true,
                product: {
                  select: {
                    name: true
                  }
                }
              },
            }
          },
        })
      })
      return isOrderCreated;
    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}