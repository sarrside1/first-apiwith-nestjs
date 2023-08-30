import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService){}
  @Get('me')
  getMe(/*@Req() req: Request*/ @GetUser() user: User) {
    return user;
  }

  @Patch()
  updateUser(@GetUser('id') id: number, userDto: EditUserDto){
    return this.userService.editUser(id, userDto);
  }
}
