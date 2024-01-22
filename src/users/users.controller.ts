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
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { Serialize } from '../interceptors';
import { AdminGuard, JwtGuard, OwnershipGuard } from '../guards';
import { CurrentUser } from './decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from './dtos/pagination.dto';

@ApiBearerAuth()
@ApiTags('Users')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  description: 'Not logged in.',
})
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
  @ApiOperation({
    summary: 'Get current user',
    description: 'Users get their information',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get information successfully.',
  })
  getMe(@CurrentUser() user: UserDto) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @Get('/:id')
  @ApiOperation({
    summary: 'Find a user',
    description: 'Admin can find other users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find a user successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The userId to find information',
    type: Number,
    example: 10,
  })
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({
    summary: 'Find all users',
    description: 'Admin can get all users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all users successfully.',
  })
  findAllUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllUsers(paginationDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AdminGuard)
  @Post()
  @ApiOperation({
    summary: 'Create a user',
    description: 'Admin create a new user with email and password',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a user successfully.',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(
      createUserDto.email,
      createUserDto.password,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AdminGuard)
  @Delete('/:id')
  @ApiOperation({
    summary: 'Remove a user',
    description: 'Admin remove a user',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Remove a user successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The userId to remove',
    type: Number,
    example: 10,
  })
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(OwnershipGuard)
  @Patch('/:id')
  @ApiOperation({
    summary: 'Update a user',
    description:
      'Users can update their information. Admin can update all users.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a user successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found.',
  })
  @ApiParam({
    name: 'id',
    description: 'The userId to update',
    type: Number,
    example: 10,
  })
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }
}
