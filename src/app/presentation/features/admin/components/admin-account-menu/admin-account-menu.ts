import { Component, ElementRef, ViewChild, inject, input, output } from '@angular/core';

@Component({
  selector: 'app-admin-account-menu',
  templateUrl: './admin-account-menu.html',
  host: {
    '(document:click)': 'closeOutside($event)',
    '(keydown.escape)': 'closeWithKeyboard($event)',
  },
})
export class AdminAccountMenu {

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  @ViewChild('dropdown', { static: true }) private dropdown!: ElementRef<HTMLDetailsElement>;
  @ViewChild('trigger', { static: true }) private trigger!: ElementRef<HTMLElement>;
  readonly username = input.required<string>();
  readonly signedOut = output<void>();

  closeOutside(event: MouseEvent): void {
    if (event.target instanceof Node && !this.host.nativeElement.contains(event.target))
      this.dropdown.nativeElement.open = false;
  }

  closeOnFocusOut(event: FocusEvent): void {
    if (
      !(event.relatedTarget instanceof Node) ||
      !this.host.nativeElement.contains(event.relatedTarget)
    )
      this.dropdown.nativeElement.open = false;
  }

  closeWithKeyboard(event: Event): void {
    if (!this.dropdown.nativeElement.open) return;
    event.preventDefault();
    this.dropdown.nativeElement.open = false;
    this.trigger.nativeElement.focus();
  }

  signOut(): void {
    this.dropdown.nativeElement.open = false;
    this.signedOut.emit();
  }
}
