import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import convert from 'xml-js';
import removeJsonTextAttribute from '../common/functions/xml.value.converter';
import { HttpException } from '@nestjs/common/exceptions';
import { PopulationDto } from './dto/findall-population.dto';
import { Cache } from 'cache-manager';
import { lastValueFrom } from 'rxjs';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import areaList from 'src/common/area-list';
// import { CreatePopulationDto } from './dto/create-population.dto';
// import { UpdatePopulationDto } from './dto/update-population.dto';

@Injectable()
export class PopulationService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  //50개 전체 지역 캐싱 처리
  async saveAll() {
    for (const area of areaList) {
      const url = `http://openapi.seoul.go.kr:8088/${process.env.POP_API_KEY}/xml/citydata/1/5/${area['AREA_NM']}`;
      const stream = this.httpService.get(encodeURI(url));
      const rawData = await lastValueFrom(stream);
      const data: PopulationDto = JSON.parse(
        convert.xml2json(rawData.data, {
          compact: true,
          spaces: 2,
          textFn: removeJsonTextAttribute,
        }),
      )['SeoulRtd.citydata']['CITYDATA']['LIVE_PPLTN_STTS'];
      const areaPopData = {
        ...data['LIVE_PPLTN_STTS'],
        AREA_NM: area['AREA_NM'],
      };
      await this.cacheManager.set(
        `POPULATION_${area['AREA_NM']}`,
        JSON.stringify(areaPopData),
      );
    }
  }

  async findAll() {
    const result: object[] = [];
    for (const area of areaList) {
      const data = JSON.parse(
        await this.cacheManager.get(`POPULATION_${area['AREA_NM']}`),
      );
      result.push(data);
    }
    return result;
  }

  //50개 전체지역 조회

  //상세조회
  // async find(placeId: string) {
  //   const test = JSON.parse(await this.cacheManager.get('test'));
  //   if (test) {
  //     const popData = test['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;
  //     return popData;
  //   }
  //   const url = `http://openapi.seoul.go.kr:8088/${process.env.POP_API_KEY}/xml/citydata/1/5/${placeId}`;
  //   const stream = this.httpService.get(encodeURI(url));
  //   const rawData = await lastValueFrom(stream);
  //   const data: PopulationDto = JSON.parse(
  //     convert.xml2json(rawData.data, {
  //       compact: true,
  //       spaces: 2,
  //       textFn: removeJsonTextAttribute,
  //     }),
  //   );
  //  ;

  //   await this.cacheManager.set('test', JSON.stringify(data));

  //   if (!data['SeoulRtd.citydata'])
  //     throw new HttpException('wrong place name', 404);
  //   else return data['SeoulRtd.citydata'].CITYDATA.LIVE_PPLTN_STTS;

  // }
}
