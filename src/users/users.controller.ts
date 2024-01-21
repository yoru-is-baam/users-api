import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from '../interceptors';
import { AdminGuard, JwtGuard, OwnershipGuard } from '../guards';
import { CurrentUser } from './decorators';

@UseGuards(JwtGuard)
@Serialize(UserDto)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('/me')
  getMe(@CurrentUser() user: UserDto) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @Delete('/:id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(OwnershipGuard)
  @Patch('/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
