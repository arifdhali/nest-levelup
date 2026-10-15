import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { BadRequestException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Decimal } from '@prisma/client/runtime/client';
import { OrdersController } from './orders.controller.js';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaMock: any;
  let txMock: any;

  beforeEach(async () => {
    txMock = {
      product: {
        findMany: vi.fn(),
        updateMany: vi.fn(),
      },
      order: {
        create: vi.fn(),
        findUnique: vi.fn(),
      },
      orderItems: {
        createMany: vi.fn(),
      },
    };

    prismaMock = {
      $transaction: vi.fn(async (callback) => callback(txMock)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should reject duplicate product IDs', async () => {
    const dto = {
      paymentMethod: 'COD',
      items: [
        { productId: 1, quantity: 1 },
        { productId: 1, quantity: 1 },
      ],
    } as CreateOrderDto;

    await expect(service.create(1, dto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should understand a mock function', () => {
    const getPrice = vi.fn();

    getPrice();
    getPrice();

    expect(getPrice).toHaveBeenCalledTimes(2);
  });

  it('should mock a product lookup', async () => {
    const findProduct = vi.fn();

    findProduct.mockResolvedValue([
      { id: 1, name: 'Keyboard', price: 100 },
      { id: 2, name: 'Pencil', price: 500 },
    ]);

    const products = await findProduct();

    expect(products).toEqual([
      { id: 1, name: 'Keyboard', price: 100 },
      { id: 2, name: 'Pencil', price: 500 },
    ]);
  });

  it('should create an order successfully', async () => {
    const data = [
      {
        id: 1,
        name: 'Keyboard',
        price: new Decimal(100),
        stock: 5,
      },
    ];

    txMock.product.findMany.mockResolvedValue(data);

    txMock.order.create.mockResolvedValue({
      id: 10,
      userId: 1,
      total_amount: new Decimal(100),
      status: 'processing',
    });

    txMock.product.updateMany.mockResolvedValue({ count: 1 });

    txMock.orderItems.createMany.mockResolvedValue({ count: 1 });

    const expectedResult = {
      total_amount: new Decimal(100),
      orderItems: [
        {
          unitPrice: new Decimal(100),
          quantity: 1,
          product: { name: 'Keyboard' },
        },
      ],
    };

    txMock.order.findUnique.mockResolvedValue(expectedResult);

    const dto = {
      paymentMethod: 'COD',
      items: [{ productId: 1, quantity: 1 }],
    } as CreateOrderDto;

    const result = await service.create(1, dto);

    expect(txMock.product.findMany).toHaveBeenCalledTimes(1);

    expect(txMock.order.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 1,
        status: 'processing',
      }),
    });

    expect(txMock.product.updateMany).toHaveBeenCalledWith({
      where: {
        id: 1,
        stock: { gte: 1 },
      },
      data: {
        stock: { decrement: 1 },
      },
    });

    expect(txMock.orderItems.createMany).toHaveBeenCalledTimes(1);
    expect(txMock.order.findUnique).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedResult);
  });

  it('should fail when stock cannot be updated', async () => {
    txMock.product.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Keyboard',
        price: new Decimal(100),
        stock: 5,
      },
    ]);

    txMock.order.create.mockResolvedValue({
      id: 10,
      userId: 1,
      total_amount: new Decimal(100),
      status: 'processing',
    });

    // Simulate a stock update failure
    txMock.product.updateMany.mockResolvedValue({ count: 0 });

    const dto = {
      paymentMethod: 'COD',
      items: [{ productId: 1, quantity: 1 }],
    } as CreateOrderDto;

    await expect(service.create(1, dto)).rejects.toThrow(
      'Insufficient stock for product id 1.',
    );

    expect(txMock.orderItems.createMany).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException when product is unavailable', async () => {
    txMock.product.findMany.mockResolvedValue([{
      productId: 1,
      name: 'Keyboard',
      price: new Decimal(100),
      stock: 5,
    },]);

    const dto = {
      paymentMethod: 'COD',
      items: [{ productId: 999, quantity: 1 }],
    } as CreateOrderDto;

    await expect(service.create(1, dto)).rejects.toThrow(
      'One or more products do not exist. Or else stock out!',
    );

    expect(txMock.order.create).not.toHaveBeenCalled();
  });

});

describe("OrdersController", () => {
  let controller: OrdersController;
  let orderServices: {
    create: ReturnType<typeof vi.fn>
  }
  beforeEach(async () => {
    orderServices = {
      create: vi.fn()
    }

    let module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: OrdersService }]
    }).compile()
    controller = module.get<OrdersController>(OrdersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
})