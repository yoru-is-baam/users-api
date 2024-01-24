import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from '../interceptors';
import { AdminGuard, JwtGuard, OwnershipGuard } from '../guards';
import { CurrentUser } from './decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { ResponseCode } from '../enums/response-code.enum';
import { User } from '@prisma/client';
import { IdNotExistsPipe } from '../pipes';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(JwtGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Serialize(UserDto, (data) => data.result.user)
  @Get('/me')
  getMe(@CurrentUser() user: User) {
    return { message: ResponseCode.OK, result: { user } };
  }

  @Serialize(UserDto, (data) => data.result.user)
  @UseGuards(AdminGuard)
  @UseInterceptors(CacheInterceptor)
  @Get('/:id')
  async findUser(@Param('id', ParseIntPipe, IdNotExistsPipe) id: number) {
    const user = await this.usersService.findById(id);
    return { message: ResponseCode.OK, result: { user } };
  }

  @Serialize(UserDto, (data) => data.result.users)
  @UseGuards(AdminGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60000)
  @Get()
  async findAllUsers(@Query() paginationDto: PaginationDto) {
    const users = await this.usersService.findAllUsers(paginationDto);
    return { message: ResponseCode.OK, result: { users } };
  }

  @Serialize(UserDto, (data) => data.result.user)
  @UseGuards(AdminGuard)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    return { message: ResponseCode.OK, result: { user } };
  }

  @Serialize(UserDto, (data) => data.result.user)
  @UseGuards(AdminGuard)
  @Delete('/:id')
  async removeUser(@Param('id', ParseIntPipe, IdNotExistsPipe) id: number) {
    const user = await this.usersService.remove(id);
    return { message: ResponseCode.OK, result: { user } };
  }

  @Serialize(UserDto, (data) => data.result.user)
  @UseGuards(OwnershipGuard)
  @Patch('/:id')
  async updateUser(
    @Param('id', ParseIntPipe, IdNotExistsPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(id, dto);
    return { message: ResponseCode.OK, result: { user: updatedUser } };
  }
}
