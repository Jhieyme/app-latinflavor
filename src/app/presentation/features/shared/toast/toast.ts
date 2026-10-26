import { Component, ElementRef, OnDestroy, afterRenderEffect, inject, viewChild } from '@angular/core';
import { ToastService } from '../../../services/toast/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast implements OnDestroy {
  readonly toast = inject(ToastService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');

  constructor() {
    afterRenderEffect(() => {
      const message = this.toast.message();
      const panel = this.panel()?.nativeElement;
      if (!panel) return;
      panel.hidePopover();
      const dialogs = this.host.nativeElement.ownerDocument.querySelectorAll('dialog[open]');
      const target = message ? dialogs.item(dialogs.length - 1) ?? this.host.nativeElement : this.host.nativeElement;
      target.appendChild(panel);
      if (message) panel.showPopover();
    });
  }

  ngOnDestroy(): void {
    const panel = this.panel()?.nativeElement;
    if (panel) {
      panel.hidePopover();
      this.host.nativeElement.appendChild(panel);
    }
  }
}
