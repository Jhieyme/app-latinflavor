import { DiningTableCards } from '../../components/dining-table-cards/dining-table-cards';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, finalize } from 'rxjs';
import { FloorKind, Zone, DiningTable } from '../../../../../../domain/models/floor/floor';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { FloorFacade } from '../../services/floor.facade';
import { FloorDialog } from '../../components/floor-dialog/floor-dialog';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-floor-management',
  imports: [FormsModule, FloorDialog, DiningTableCards],
  templateUrl: './floor-management.html',
  styleUrl: '../../floor.css',
})
export class FloorManagement implements OnInit {

  private readonly facade = inject(FloorFacade);
  private readonly store = inject(AdminSessionStore);
  private generation = 0;
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  readonly kind: FloorKind = inject(ActivatedRoute).snapshot.data['kind'];
  readonly tableView = signal<'cards' | 'list'>('cards');

  readonly tables = computed(() =>
    this.items().filter((item): item is DiningTable => 'tableCode' in item),
  );

  readonly title = this.kind === 'zones' ? 'Zonas' : 'Mesas';
  readonly items = signal<(Zone | DiningTable)[]>([]);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly total = signal(0);
  readonly totalPages = signal(0);
  readonly page = signal(0);
  readonly dialog = signal<{ id?: string; mode: 'edit' | 'detail' | 'status' } | null>(null);

  readonly rows = computed(() =>
    this.items().map((item) =>
      'code' in item
        ? {
            id: item.id,
            code: item.code,
            label: item.name,
            detail: item.description || 'Sin descripción',
            active: item.active,
          }
        : {
            id: item.id,
            code: item.tableCode,
            label: `Mesa ${item.tableNumber}`,
            detail: `${item.capacity} personas`,
            active: item.active,
          },
    ),
  );

  query = '';
  filter = this.kind === 'zones' ? 'name' : 'tableCode';
  sort = this.kind === 'zones' ? 'name' : 'tableNumber';
  direction: 'asc' | 'desc' = 'asc';
  size = 10;

  private request?: Subscription;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.timer);
      this.request?.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.load();
  }

  searchChanged(): void {
    clearTimeout(this.timer);
    this.request?.unsubscribe();
    this.loading.set(true);
    this.timer = setTimeout(() => this.load(0), 350);
  }

  selectStatus(status: '' | 'true' | 'false'): void {
    this.filter = status ? 'isActive' : 'tableCode';
    this.query = status;
    this.load(0);
  }

  filterChanged(): void {
    this.query = '';
    this.load(0);
  }

  load(page = this.page()): void {
    if (!this.store.accessToken()) return;
    const generation = ++this.generation;
    clearTimeout(this.timer);
    this.request?.unsubscribe();
    this.loading.set(true);
    this.failed.set(false);
    this.page.set(page);
    this.request = this.facade
      .search(this.kind, {
        page,
        size: this.size,
        q: this.query,
        filter: this.filter,
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
