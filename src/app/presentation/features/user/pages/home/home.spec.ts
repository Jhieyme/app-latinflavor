import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../../../../../app.routes';
import { Home } from './home';
import { Reservation } from '../reservation/reservation';

describe('User home navigation', () => {
  it('opens the reservation form from the welcome card', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user', Home);
    const link = harness.routeNativeElement?.querySelector('a[href="/user/reserva"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('Hacer una reserva');
    await harness.navigateByUrl(link.getAttribute('href')!, Reservation);
    expect(harness.routeNativeElement?.querySelector('h2')?.textContent).toContain('Reserva tu mesa');
  });
});
