import { LoggedInGuard } from 'src/auth/logged-in.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Users } from 'src/entities/Users';
import { User } from 'src/common/decorators/user.decorator';
import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { UndefinedToNullInterceptor } from '../common/interceptors/undefinedToNull.interceptor';
import { AreaService } from './area.service';
import { FindAllAreaDto, FindOneAreaDto } from './dto/findall-area.dto';
import { LikeAreaDto } from './dto/like-area.dto';
import { FindAreaPopDto } from './dto/population.dto';
import { FindAreaWeatherDto } from './dto/weather.dto';
import { FindAreaAirDto } from './dto/air.dto';

@ApiTags('AREA')
@UseInterceptors(UndefinedToNullInterceptor)
@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @ApiOperation({ summary: '도시 50개 지역 이름, 좌표 조회' })
  @ApiResponse({
    type: FindAllAreaDto,
    status: 200,
    description: '도시 50개 지역 이름, 좌표 조회',
  })
  @Get()
  getAllAreas() {
    return this.areaService.getAllAreas();
  }

  @ApiOperation({ summary: '지역 정보 단건 조회' })
  @ApiResponse({
    type: FindOneAreaDto,
    status: 200,
    description: '지역 정보 단건 조회',
  })
  @Get('/:areaName')
  getArea(@Param('areaName') areaName: string) {
    return this.areaService.getArea(areaName);
  }

  @ApiOperation({ summary: '지역 인구 정보 단건 조회' })
  @ApiResponse({
    type: FindAreaPopDto,
    status: 200,
    description: '지역 인구 정보 단건 조회',
  })
  @Get('/:areaName/population')
  getAreaPopulation(@Param('areaName') areaName: string) {
    return this.areaService.getAreaPopulation(areaName);
  }

  @ApiOperation({ summary: '지역 날씨 정보 단건 조회' })
  @ApiResponse({
    type: FindAreaWeatherDto,
    status: 200,
    description: '지역 날씨 정보 단건 조회',
  })
  @Get('/:areaName/weather')
  getAreaWeather(@Param('areaName') areaName: string) {
    return this.areaService.getAreaWeather(areaName);
  }

  @ApiOperation({ summary: '지역 대기환경 정보 단건 조회' })
  @ApiResponse({
    type: FindAreaAirDto,
    status: 200,
    description: '지역 대기환경 정보 단건 조회',
  })
  @Get('/:areaName/air')
  getAreaAirQuality(@Param('areaName') areaName: string) {
    return this.areaService.getAreaAirQuality(areaName);
  }

  @ApiOperation({ summary: '지역 좋아요' })
  @ApiResponse({
    type: LikeAreaDto,
    status: 200,
    description: '지역 좋아요',
  })
  @UseGuards(LoggedInGuard)
  @Get('like/:areaName')
  likeArea(@User() user: Users, @Param('areaName') areaName: string) {
    return this.areaService.likeArea(user, areaName);
  }
}
