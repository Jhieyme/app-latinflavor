import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { ScheduleRepository } from '../../../domain/repository/schedule/schedule.repository';
import {
  CreateScheduleInput,
  ScheduleInput,
  ScheduleSearch,
} from '../../../domain/models/schedule/operating-hours';
import { ScheduleResponse, SchedulePageResponse } from '../../dtos/schedule-response';
import { mapSchedule, mapScheduleCreate, mapScheduleUpdate } from '../../mappers/schedule.mapper';
import { ApiManifest } from '../../constants/api-manifest';

@Injectable()
export class ScheduleRepositoryImpl extends ScheduleRepository {

  private readonly http = inject(HttpClient);
  private readonly base = ApiManifest.BUSINESS.SCHEDULE;

  override search(query: ScheduleSearch) {
    let params = new HttpParams()
      .set('page', query.page)
      .set('size', query.size)
      .set('sort', `${query.sort},${query.direction}`);
    if (query.day) params = params.set('q', query.day).set('filters', 'dayOfWeek');
    return this.http.get<SchedulePageResponse>(`${this.base}/search`, { params }).pipe(
      map((response) => ({
        items: response.content.map(mapSchedule),
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      })),
    );
  }

  override get(id: string) {
    return this.http
      .get<ScheduleResponse>(`${this.base}/${encodeURIComponent(id)}`)
      .pipe(map(mapSchedule));
  }

  override create(data: CreateScheduleInput) {
    return this.http.post<unknown>(this.base, mapScheduleCreate(data)).pipe(map(() => undefined));
  }

  override update(id: string, data: ScheduleInput) {
    return this.http.put<void>(`${this.base}/${encodeURIComponent(id)}`, mapScheduleUpdate(data));
  }
}
