import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service.js";
import { RegisterDto } from "./dto/login.js";
@Injectable()

export class AuthServices {
    private readonly activeRefreshTokens = new Set<string>();

    constructor(private readonly jwtservices: JwtService, private readonly prismaService: PrismaService) { }

    async register(body: RegisterDto) {

        try {
            const { name, email, password, user_permission } = body;
            Array.from(user_permission ?? [])
            let isUser = await this.prismaService.user.findUnique({
                where: {
                    email,
                    status: true
                }
            })
            if (isUser) {
                throw new ConflictException("This user already exists")
            }

            const hashPassword = await bcrypt.hash(password, 10);

            let payload = {
                name,
                email,
                password: hashPassword,
                status: true,
                ...(user_permission != undefined && user_permission)
            }

            await this.prismaService.user.create({
                data: payload
            })
            return {
                status: true
            }
        } catch (err) {
            throw err;

        }


    }

    async login(email: string, password: string) {

        try {


            let isUser = await this.prismaService.user.findUnique({
                where: {
                    email,
                    status: true,
                },
                omit: {
                    createdAt: true,
                    updatedAt: true,
                    status: true,
                }
            });

            if (!isUser) {
                throw new NotFoundException("No users found");
            }
            let comparedPassword = await bcrypt.compare(password, isUser.password);

            if (!comparedPassword) {
                throw new UnauthorizedException("Invalid email or password");
            }

            const payload = {
                sub: isUser.id,
                name: isUser.name,
                email: isUser.email,
                role: isUser.role,
                permissions: isUser.user_permission
            }

            const accessToken = await this.jwtservices.signAsync({ ...payload, token_type: "access" })
            const refreshToken = await this.jwtservices.signAsync({ ...payload, token_type: "refresh" }, {
                expiresIn: "7d"
            });

            this.activeRefreshTokens.add(refreshToken)

            return { status: true, accessToken, refreshToken };
        } catch (error) {
            throw error;
        }
    }


    async refreshToken(refToken: string) {

        try {

            const payload = await this.jwtservices.verifyAsync(refToken);


            if (payload.token_type != "refresh") {
                throw new UnauthorizedException("Invalid refresh token")
            }

            if (!this.activeRefreshTokens.has(refToken)) {
                throw new UnauthorizedException("Refresh token is already used or invoked")
            }
            this.activeRefreshTokens.delete(refToken);

            const newPayload = {
                sub: payload.sub,
                email: payload.email,
                role: payload.role
            }

            const accessToken = await this.jwtservices.signAsync({ ...newPayload, token_type: "access" })
            const refreshToken = await this.jwtservices.signAsync({ ...newPayload, token_type: "refresh" }, {
                expiresIn: "7d"
            });

            this.activeRefreshTokens.add(refreshToken)

            return {
                accessToken,
                refreshToken
            }
        } catch (err) {
            console.log(err)
            throw new UnauthorizedException("Invalid or expired refresh token")
        }

    }





}