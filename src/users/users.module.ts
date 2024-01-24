import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CacheModule } from '@nestjs/cache-manager';
import { IdNotExistsPipe } from '../pipes';
import { EmailExistsRule } from '../decorators';

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: [UsersService, IdNotExistsPipe, EmailExistsRule],
  exports: [UsersService],
})
export class UsersModule {}
