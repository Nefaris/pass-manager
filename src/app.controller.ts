import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('index')
  async index() {
    const passwords = await this.prisma.password.findMany();
    return { passwords };
  }

  @Post('/add-password')
  async addPassword(
    @Res() res: Response,
    @Body() data: { name: string; username: string; password: string },
  ) {
    const created = await this.prisma.password.create({
      data: {
        name: data.name,
        username: data.username,
        password: data.password,
      },
    });

    console.log(created);

    res.redirect('/');
  }
}
