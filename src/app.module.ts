import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from './config/config.module';
import { TypeOrmConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { AreaModule } from './area/area.module';
import * as redisStore from 'cache-manager-ioredis';
import { ScheduleModule } from '@nestjs/schedule';
import { SeoulModule } from './seoul/seoul.module';
import { RouteModule } from './route';
import { TouristSpotModule } from './tourist_spot/tourist_spot.module';
import { LogoModule } from './logo/logo.module';

const CACHE_URL = (stage = process.env.NODE_ENV) => {
  switch (stage) {
    case 'development':
      return '127.0.0.1';
    case 'production':
      return process.env.ELASTICACHE;
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      useClass: TypeOrmConfigService,
      inject: [TypeOrmConfigService],
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: CACHE_URL(),
      port: 6379,
      ttl: 3600,
    }),
    ScheduleModule.forRoot(),
    AreaModule,
    SeoulModule,
    RouteModule,
    TouristSpotModule,
    LogoModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
