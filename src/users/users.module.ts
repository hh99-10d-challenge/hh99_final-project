import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Friends } from 'src/entities/Friends';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { multerOptionsFactory } from 'src/common/multer.options';
import { TermsCondition } from 'src/entities/termscondition';
import { RoutesInfo } from '../entities/routesinfo';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Friends, TermsCondition, RoutesInfo]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
