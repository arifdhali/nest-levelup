import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class UserServices {
    constructor(private readonly prisma: PrismaService) { }



    async getProfileById(id: number) {

        try {
            let isUser = await this.prisma.user.findUnique({
                where: {
                    id,
                    status: true
                },
            })


            if (!isUser) {
                throw new NotFoundException("User not found");
            }


            return isUser;


        } catch (error) {
            throw error;
        }

    }

    async getOrderByUserId(id: number) {

        try {


            let user = await this.getProfileById(id);

            if (!user) {
                throw new NotFoundException("User not found");
            }

            let userOrders = await this.prisma.user.findUnique({
                where: {
                    email: user.email,
                    status: true
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    order: {
                        omit: {
                            userId: true
                        }
                    }
                }
            })
            return userOrders?.order;

        } catch (error) {
            throw error
        }



    }
}