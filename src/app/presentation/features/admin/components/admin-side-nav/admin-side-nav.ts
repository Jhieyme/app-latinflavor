import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-side-nav.html',
  host: { class: 'block h-full' },
})
export class AdminSideNav {
  readonly username = input('Administrador');
  readonly signedOut = output<void>();
  readonly dismissed = output<void>();
}
