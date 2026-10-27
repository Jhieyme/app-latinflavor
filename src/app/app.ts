import { UserSessionExpired } from './presentation/features/user/session-expired/user-session-expired';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './presentation/features/shared/toast/toast';
import { SessionExpired } from './presentation/features/admin/session-expired/session-expired';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, SessionExpired, UserSessionExpired],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
