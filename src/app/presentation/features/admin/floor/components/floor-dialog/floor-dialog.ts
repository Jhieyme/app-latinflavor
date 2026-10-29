import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, forkJoin, of } from 'rxjs';
import { FloorKind, Zone, DiningTable } from '../../../../../../domain/models/floor/floor';
import { FloorFacade } from '../../services/floor.facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';
@Component({
  selector: 'app-floor-dialog',
  imports: [FormsModule],
  templateUrl: './floor-dialog.html',
  styleUrl: '../../floor.css',
})
export class FloorDialog implements AfterViewInit {

  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly kind = input.required<FloorKind>();
  readonly recordId = input<string>();
  readonly mode = input<'edit' | 'detail' | 'status'>('edit');
  readonly dismissed = output<void>();
  readonly saved = output<void>();
  private readonly facade = inject(FloorFacade);
  private readonly toast = inject(ToastService);
  private readonly store = inject(AdminSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly saving = signal(false);
  readonly record = signal<Zone | DiningTable | null>(null);
  readonly zones = signal<Zone[]>([]);

  code = '';
  name = '';
  description = '';
  zoneId = '';
  tableNumber: number | null = null;
  capacity: number | null = 4;

  constructor() {
    effect(() => {
      if (this.store.expired()) {
        this.dialog.nativeElement.close();
        this.dismissed.emit();
      }
    });
  }

  ngAfterViewInit(): void {
    this.dialog.nativeElement.showModal();
    this.load();
  }

  load(): void {
    if (this.loading() || !this.store.accessToken()) return;
    this.loading.set(true);
    this.failed.set(false);
    const id = this.recordId();
    forkJoin({
      record: id ? this.facade.get(this.kind(), id) : of(null),
      zones: this.kind() === 'tables' ? this.facade.zones() : of([] as Zone[]),
    })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: ({ record, zones }) => {
          this.record.set(record);
          this.zones.set(zones);
          if (record && 'code' in record) {
            this.code = record.code;
            this.name = record.name;
            this.description = record.description;
          }
          if (record && 'zoneId' in record) {
            this.code = record.tableCode;
            this.zoneId = record.zoneId;
            this.tableNumber = record.tableNumber;
            this.capacity = record.capacity;
          }
        },
        error: (error: unknown) => {
          this.failed.set(true);
          this.toast.showError(error);
        },
      });
  }

  title(): string {
    const noun = this.kind() === 'zones' ? 'zona' : 'mesa';
    if (this.mode() === 'detail') return `Detalle de ${noun}`;
    if (this.mode() === 'status')
      return `${this.record()?.active ? 'Deshabilitar' : 'Habilitar'} ${noun}`;
    return `${this.recordId() ? 'Editar' : 'Nueva'} ${noun}`;
  }

  zoneName(): string {
    return this.zones().find((zone) => zone.id === this.zoneId)?.name ?? this.zoneId;
  }

  close(event?: Event): void {
    event?.preventDefault();
    if (this.saving()) return;
    this.dialog.nativeElement.close();
    this.dismissed.emit();
  }
  
  submit(form: NgForm): void {
    if (this.saving() || this.loading() || this.failed() || !this.store.accessToken()) return;
    if (this.mode() === 'detail') return;
    const status = this.mode() === 'status';
    if (
      !status &&
      (form.invalid ||
        (this.kind() === 'tables' &&
          (!Number.isInteger(this.tableNumber) || !Number.isInteger(this.capacity))))
    ) {
      form.control.markAllAsTouched();
      this.toast.show('Revisa los campos obligatorios y sus valores.', 'error');
      return;
    }
    if (
      !status &&
      this.kind() === 'tables' &&
      !this.zones().some((zone) => zone.id === this.zoneId && zone.active)
    ) {
      this.toast.show('Selecciona una zona activa para guardar la mesa.', 'error');
      return;
    }
    const record = this.record();
    if (status && !record) return;
    const request =
      status && record
        ? this.facade.setActive(this.kind(), record.id, !record.active)
        : this.kind() === 'zones'
          ? this.facade.save(
            'zones',
            {
              code: this.code.trim(),
              name: this.name.trim(),
              description: this.description.trim(),
            },
            this.recordId(),
          )
          : this.facade.save(
            'tables',
            { zoneId: this.zoneId, tableNumber: this.tableNumber!, capacity: this.capacity! },
            this.recordId(),
          );
    this.saving.set(true);
    request
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          const noun = this.kind() === 'zones' ? 'Zona' : 'Mesa';
          this.toast.show(
            `${noun} ${status ? (record?.active ? 'deshabilitada' : 'habilitada') : this.recordId() ? 'actualizada' : 'creada'} correctamente.`,
          );
          this.dialog.nativeElement.close();
          this.saved.emit();
        },
        error: (error: unknown) => this.toast.showError(error),
      });
  }
}
