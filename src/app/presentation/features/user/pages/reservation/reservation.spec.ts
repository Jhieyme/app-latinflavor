import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../../app.routes';
import { Reservation } from './reservation';
import { Home } from '../home/home';

describe('User reservation home', () => {
  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date('2026-09-22T18:15:00Z'));
  });
  afterEach(() => jasmine.clock().uninstall());

  it('opens the user home from the root route', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/', Home);
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Bienvenido');
  });

  it('limits calendar navigation to the current month and the next two months', () => {
    const home = new Reservation();
    home.changeMonth(-1);
    expect(home.month().getMonth()).toBe(8);
    home.changeMonth(1);
    home.changeMonth(1);
    home.changeMonth(1);
    expect(home.month().getMonth()).toBe(10);
    expect(home.canGoForward()).toBeFalse();
  });

  it('rejects past dates and resets the hour when the date changes', () => {
    const home = new Reservation();
    home.selectDate(new Date(2026, 8, 21));
    expect(home.selectedDate().getDate()).toBe(22);
    home.selectedTime.set('19:00');
    home.selectDate(new Date(2026, 8, 23));
    expect(home.selectedTime()).toBe('');
  });

  it('disables elapsed times in Lima and requires a future hour to continue', () => {
    const home = new Reservation();
    expect(home.timeDisabled('13:00')).toBeTrue();
    expect(home.timeDisabled('13:30')).toBeFalse();
    home.continue();
    expect(home.step()).toBe(1);
    home.selectedTime.set('13:00');
    home.continue();
    expect(home.step()).toBe(1);
    home.selectedTime.set('19:00');
    home.continue();
    expect(home.step()).toBe(2);
  });

  it('requires a valid name and email before showing the preview', async () => {
    TestBed.configureTestingModule({ imports: [Reservation] });
    const fixture = TestBed.createComponent(Reservation);
    fixture.componentInstance.step.set(2);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const submit = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submit.disabled).toBeTrue();
    fixture.componentInstance.name = 'Ana Torres';
    fixture.componentInstance.email = 'ana@example.com';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(submit.disabled).toBeFalse();
    submit.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No se ha creado una reserva');
  });
});

