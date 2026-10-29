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
import { finalize } from 'rxjs';
import { WeekDay } from '../../../../../../domain/models/schedule/operating-hours';
import { ScheduleFacade } from '../../services/schedule.facade';
import { WEEK_DAYS, WEEK_DAY_LABELS } from '../../constants/week-days';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';
@Component({
  selector: 'app-schedule-dialog',
  imports: [FormsModule],
  templateUrl: './schedule-dialog.html',
  styleUrl: '../../../styles/management.css',
})
export class ScheduleDialog implements AfterViewInit {

  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly recordId = input<string>();
  readonly detail = input(false);
  readonly dismissed = output<void>();
  readonly saved = output<void>();
  private readonly facade = inject(ScheduleFacade);
  private readonly toast = inject(ToastService);
  private readonly store = inject(AdminSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  readonly days = WEEK_DAYS;
  readonly labels = WEEK_DAY_LABELS;
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly saving = signal(false);
  day: WeekDay | '' = '';
  openingTime = '';
  closingTime = '';
  interval: number | null = 30;

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
    const id = this.recordId();
    if (!id || this.loading() || !this.store.accessToken()) return;
    this.loading.set(true);
    this.failed.set(false);
    this.facade
      .get(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (record) => {
          this.day = record.dayOfWeek;
          this.openingTime = record.openingTime;
          this.closingTime = record.closingTime;
          this.interval = record.reservationIntervalMinutes;
        },
        error: (error: unknown) => {
          this.failed.set(true);
          this.toast.showError(error);
        },
      });
  }

  close(event?: Event): void {
    event?.preventDefault();
    if (this.saving()) return;
    this.dialog.nativeElement.close();
    this.dismissed.emit();
  }

  submit(form: NgForm): void {
    if (
      this.saving() ||
      this.loading() ||
      this.failed() ||
      this.detail() ||
      !this.store.accessToken()
    )
      return;
    const milliseconds = Math.round((this.interval ?? 0) * 60_000);
    if (form.invalid || !this.day || !Number.isSafeInteger(milliseconds) || milliseconds <= 0) {
      form.control.markAllAsTouched();
      this.toast.show(
        'Completa el día, las horas y un intervalo de reservas mayor que cero.',
        'error',
      );
      return;
    }

    const seconds = (time: string) =>
      time.split(':').reduce((total, part) => total * 60 + Number(part), 0);

    const normalize = (time: string) => (time.length === 5 ? `${time}:00` : time);

    if (seconds(normalize(this.openingTime)) >= seconds(normalize(this.closingTime))) {
      this.toast.show('La hora de apertura debe ser anterior a la hora de cierre.', 'error');
      return;
    }

    this.saving.set(true);
    this.facade
      .save(
        {
          dayOfWeek: this.day,
          openingTime: normalize(this.openingTime),
          closingTime: normalize(this.closingTime),
          reservationIntervalMinutes: this.interval!,
        },
        this.recordId(),
      )
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.show(
            this.recordId()
              ? 'Horario actualizado correctamente.'
              : 'Horario creado correctamente.',
          );
          this.dialog.nativeElement.close();
          this.saved.emit();
        },
        error: (error: unknown) => this.toast.showError(error),
      });
  }
}
