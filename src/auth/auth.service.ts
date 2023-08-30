import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      //Generate the password hash
      const hash = await argon.hash(dto.password);
      // Save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        // select: {
        //   id: true,
        //   email: true,
        //   createdAt: true,
        // },
      });
      //Return new user created
      delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          //duplicate field
          throw new ForbiddenException('Credentials taken');
        }
        throw error;
      }
    }
  }
  async login(dto: AuthDto) {
    //Find the user first by emal
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    // If user does not exist throw exception
    const passwordMatch = await argon.verify(user.hash, dto.password);
    if (!passwordMatch) throw new ForbiddenException('Credentials incorrect');
    //Compare the password hash
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET_KEY'),
    });
    return {
      access_token: token,
    };
  }
}
