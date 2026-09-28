import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
})
export class AppInput implements ControlValueAccessor {
  readonly control = inject(NgControl, { optional: true, self: true });
  @Input({ required: true }) inputId = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() inputmode = 'text';
  @Input() autocapitalize = 'none';
  @Input() spellcheck = false;
  @Input() maxlength: string | number | null = null;
  @Input() pattern: string | RegExp | null = null;
  @Input() describedBy: string | null = null;
  @Input() invalid: boolean | null = null;
  @Input({ transform: booleanAttribute }) required = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() value = '';
  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    if (this.control) this.control.valueAccessor = this;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  updateValue(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
