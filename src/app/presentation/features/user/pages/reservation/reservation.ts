import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-reservation',
  imports: [FormsModule],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css',
})
export class Reservation {
  private limaNow(): Date { return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' })); }
  private readonly today = this.limaNow();
  readonly firstDay = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  readonly lastDay = new Date(this.today.getFullYear(), this.today.getMonth() + 3, 0);
  readonly month = signal(new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), 1));
  readonly selectedDate = signal<Date>(this.firstDay);
  readonly guests = signal(2);
  readonly selectedTime = signal('');
  readonly step = signal(1);

  readonly times = ['12:00', '12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00'];
  readonly weekdays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  readonly guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  name = '';
  email = '';
  phone = '';
  notes = '';
  readonly monthLabel = computed(() =>
    new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(this.month()),
  );
  readonly dateLabel = computed(() =>
    new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'long' }).format(this.selectedDate()),
  );
  readonly canGoBack = computed(() => this.month().getTime() > new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), 1).getTime());
  readonly canGoForward = computed(() => this.month().getMonth() !== this.lastDay.getMonth() || this.month().getFullYear() !== this.lastDay.getFullYear());
  readonly days = computed(() => {
    const year = this.month().getFullYear();
    const month = this.month().getMonth();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7;
    const count = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: count }, (_, index) => new Date(year, month, index + 1)),
    ];
  });

  changeMonth(direction: number): void {
    if ((direction < 0 && !this.canGoBack()) || (direction > 0 && !this.canGoForward())) return;
    this.month.update(date => new Date(date.getFullYear(), date.getMonth() + direction, 1));
  }

  isPast(date: Date): boolean {
    return date < this.firstDay;
  }

  isSelected(date: Date): boolean {
    return date.getTime() === this.selectedDate().getTime();
  }

  selectDate(date: Date): void {
    if (this.isPast(date)) return;
    this.selectedDate.set(date);
    this.selectedTime.set('');
  }

  fullDate(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'full' }).format(date);
  }

  timeDisabled(time: string): boolean {
    const now = this.limaNow();
    const slot = new Date(this.selectedDate());
    const [hours, minutes] = time.split(':').map(Number);
    slot.setHours(hours, minutes);
    return slot <= now;
  }

  continue(): void {
    if (!this.selectedTime() || this.timeDisabled(this.selectedTime())) {
      this.selectedTime.set('');
      return;
    }
    this.step.set(2);
  }

  review(): void {

    this.step.set(3);
  }
}


