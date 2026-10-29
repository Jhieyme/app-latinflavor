import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import {
  OperatingHours,
  WeekDay,
  ScheduleSort,
} from '../../../../../../domain/models/schedule/operating-hours';
import { ScheduleFacade } from '../../services/schedule.facade';
import { ScheduleDialog } from '../../components/schedule-dialog/schedule-dialog';
import { WEEK_DAYS, WEEK_DAY_LABELS } from '../../constants/week-days';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-schedule-management',
  imports: [FormsModule, ScheduleDialog],
  templateUrl: './schedule-management.html',
  styleUrl: '../../../styles/management.css',
})
export class ScheduleManagement implements OnInit {

  private readonly facade = inject(ScheduleFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  private request?: Subscription;
  private generation = 0;
  readonly days = WEEK_DAYS;
  readonly labels = WEEK_DAY_LABELS;
  readonly items = signal<OperatingHours[]>([]);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly page = signal(0);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly dialog = signal<{ id?: string; detail: boolean } | null>(null);

  day: WeekDay | '' = '';
  sort: ScheduleSort = 'dayOfWeek';
  direction: 'asc' | 'desc' = 'asc';
  size = 10;

  constructor() {
    this.destroyRef.onDestroy(() => this.request?.unsubscribe());
  }

  ngOnInit(): void {
    this.load();
  }

  load(page = this.page()): void {
    if (!this.store.accessToken()) return;
    const generation = ++this.generation;
    this.request?.unsubscribe();
    this.loading.set(true);
    this.failed.set(false);
    this.page.set(page);
    this.request = this.facade
      .search({
        day: this.day || undefined,
        page,
        size: this.size,
        sort: this.sort,
        direction: this.direction,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          if (generation === this.generation) this.loading.set(false);
        }),
      )
      .subscribe({
        next: (result) => {
          if (page > 0 && page >= result.totalPages) {
            this.load(Math.max(0, result.totalPages - 1));
            return;
          }
          this.items.set(result.items);
          this.total.set(result.totalElements);
          this.totalPages.set(result.totalPages);
          this.page.set(result.page);
        },
        error: (error: unknown) => {
          this.failed.set(true);
          this.items.set([]);
          this.total.set(0);
          this.totalPages.set(0);
          this.toast.showError(error);
        },
      });
  }

  saved(): void {
    this.dialog.set(null);
    this.load();
  }

}
