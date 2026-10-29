import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { FloorRepository } from '../../../domain/repository/floor/floor.repository';
import { FloorKind, FloorInputs, FloorSearch } from '../../../domain/models/floor/floor';
import { FloorPageResponse, FloorResponses } from '../../dtos/floor-response';
import { FLOOR_MAPPERS } from '../../mappers/floor.mapper';
import { ApiManifest } from '../../constants/api-manifest';
@Injectable()
export class FloorRepositoryImpl extends FloorRepository {
  private readonly http = inject(HttpClient);
  private readonly endpoints = { zones: ApiManifest.BUSINESS.ZONE, tables: ApiManifest.BUSINESS.DINING_TABLE };
  override search<K extends FloorKind>(kind: K, query: FloorSearch) {
    let params = new HttpParams().set('page', query.page).set('size', query.size).set('sort', `${query.sort},${query.direction}`);
    if (query.q?.trim()) {
      params = params.set('q', query.q.trim());
      if (query.filter) params = params.set('filters', query.filter);
    }
    return this.http.get<FloorPageResponse<FloorResponses[K]>>(`${this.endpoints[kind]}/search`, { params }).pipe(
      map(response => ({ items: response.content.map(FLOOR_MAPPERS[kind]), page: response.page, size: response.size, totalElements: response.totalElements, totalPages: response.totalPages })),
    );
  }
  override get<K extends FloorKind>(kind: K, id: string) {
    return this.http.get<FloorResponses[K]>(`${this.endpoints[kind]}/${encodeURIComponent(id)}`).pipe(map(FLOOR_MAPPERS[kind]));
  }
  override create<K extends FloorKind>(kind: K, data: FloorInputs[K]) {
    return this.http.post<unknown>(this.endpoints[kind], data).pipe(map(() => undefined));
  }
  override update<K extends FloorKind>(kind: K, id: string, data: FloorInputs[K]) {
    return this.http.put<void>(`${this.endpoints[kind]}/${encodeURIComponent(id)}`, data);
  }
  override setActive(kind: FloorKind, id: string, active: boolean) {
    const base = `${this.endpoints[kind]}/${encodeURIComponent(id)}`;
    return active ? this.http.patch<void>(`${base}/enable`, {}) : this.http.delete<void>(`${base}/disable`);
  }
}
