import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { CurrentUser } from '../common/decorator/current-user.js';
import { AuthGuard } from '../auth/guard/auth.guard.js';
import { RolesGuard } from '../auth/guard/roles.guard.js';
import { Roles } from '../common/decorator/roles.js';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post("create")
  @Roles("user", "admin")
  async create(@CurrentUser() user: any, @Body() createOrderDto: CreateOrderDto) {

    try {
      return await this.ordersService.create(user.sub, createOrderDto);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
