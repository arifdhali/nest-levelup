import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { updateDTO } from "./dto/update.product.js";


@Injectable()
export class ProductService {

    constructor(private readonly prismaService: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) { }
    private productListVersion = 1;

    async getProduct(body: any) {
        let perPage = body.perPage;
        let offset = body.offset * perPage;
        try {


            const cacheKey = `products:v${this.productListVersion}:in-stock:pagePage=${perPage}:offset=${offset}`

            let start = performance.now();

            const cachedProducts = await this.cacheManager.get(cacheKey)

            if (cachedProducts != undefined) {
                console.log(`CACHE HIT total: ${(performance.now() - start).toFixed(2)} ms`);
                return cachedProducts;
            }

            let dbStart = performance.now();
            let products = await this.prismaService.product.findMany({
                where: {
                    stock: {
                        gte: 1
                    }
                },
                take: perPage,
                skip: offset,
                orderBy: { id: "asc" }
            })
            let dbTime = performance.now() - dbStart;

            await this.cacheManager.set(cacheKey, products, 60_000);


            console.log(`Database query: ${dbTime.toFixed(2)} ms`);
            console.log(`Cache MISS total: ${(performance.now() - start).toFixed(2)} ms`);


            return products
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(error)
        }



    }

    async update(id: number, data: updateDTO) {

        try {

            let product = await this.prismaService.product.findUnique({
                where: {
                    id
                }
            });

            if (!product) {
                throw new NotFoundException("No product found!")
            }

            if (data.stock < 1) {
                throw new NotFoundException("Stock cannot be less than 1")
            }

            data.stock += product.stock;



            await this.prismaService.product.update({
                where: {
                    id
                },
                data
            })
            this.productListVersion++;

            return {
                msg: "Product update successfull"
            }



        } catch (error) {

            console.log(error)
            throw new InternalServerErrorException(error)
        }
    }



}