import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          url: config.get<string>('DB_URL'),
          entities: [User],
          migrationsRun: config.get<string>('NODE_ENV') === 'test',
          synchronize: config.get<string>('NODE_ENV') === 'development',
        };
      },
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
