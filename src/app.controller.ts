import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from './prisma.service';
import { CryptoService } from './crypto.service';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
  ) {}

  @Get()
  @Render('index')
  async index() {
    const dbPasswords = await this.prisma.password.findMany();
    const passwords = dbPasswords.map((dbPassword) => ({
      id: dbPassword.id,
      name: dbPassword.name,
      username: dbPassword.username,
      password: this.crypto.decrypt(dbPassword.password),
    }));

    return { passwords };
  }

  @Post('/add-password')
  async addPassword(
    @Res() res: Response,
    @Body() data: { name: string; username: string; password: string },
  ) {
    await this.prisma.password.create({
      data: {
        name: data.name,
        username: data.username,
        password: this.crypto.encrypt(data.password),
      },
    });

    res.redirect('/');
  }

  @Post('/update-password')
  async updatePassword(
    @Res() res: Response,
    @Body() data: { id: string; username: string; password: string },
  ) {
    await this.prisma.password.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        password: this.crypto.encrypt(data.password),
      },
    });

    res.redirect('/');
  }

  @Post('/delete-password')
  async deletePassword(@Res() res: Response, @Body() data: { id: string }) {
    await this.prisma.password.delete({ where: { id: data.id } });
    res.redirect('/');
  }
}
