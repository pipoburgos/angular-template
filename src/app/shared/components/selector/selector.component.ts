import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Input,
  OnDestroy,
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms'
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs'

import { CommonModule } from '@angular/common'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { normalize } from '@shared'

export interface ComboItem {
  id: string
  value: string
}
@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  template: `
    <mat-form-field class="selector" (blur)="onBlur()">
      <mat-label>{{ label }}</mat-label>
      <input
        type="text"
        [placeholder]="placeholder"
        matInput
        [formControl]="control"
        [matAutocomplete]="auto"
      />
      <mat-autocomplete
        autoActiveFirstOption
        #auto="matAutocomplete"
        (optionSelected)="onOptionSelected($event.option.value)"
      >
        @for (item of itemsFiltered | async; track item.id) {
          <mat-option [value]="item.value">{{ item.value }}</mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    `
      .selector {
        width: inherit;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true,
    },
  ],
})
export class SelectorComponent implements ControlValueAccessor, OnDestroy {
  @Input({ required: true }) public items!: ComboItem[]
  @Input({ required: true }) public label!: string
  @Input({ required: true }) public placeholder!: string
  public control = inject(FormBuilder).control<string | null>(null)
  public itemsFiltered!: Observable<ComboItem[]>

  private readonly unsubscribe$ = new Subject<void>()
  private id: string | null = null
  private onChange!: (id: string | null) => void
  private onTouch!: () => void

  public ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  public writeValue(id: string): void {
    this.id = id
    this.control.setValue(
      !id ? null : (this.items.find(c => c.id === id)?.value ?? null),
    )
    this.itemsFiltered = this.control.valueChanges.pipe(
      takeUntil(this.unsubscribe$),
      startWith(this.control.value),
      map(value => this.filter(value)),
    )
  }

  private filter(value: string | null): ComboItem[] {
    if (!value) {
      if (this.id) {
        this.id = null
        this.onChange(this.id)
        this.onTouch()
      }
      return this.items
    }
    return this.items.filter(item =>
      normalize(item.value).includes(normalize(value)),
    )
  }

  public onOptionSelected(value: string): void {
    const item = this.items.find(c => c.value === value)
    if (this.id !== item?.id) {
      this.id = item?.id ?? null
      this.onChange(this.id)
      this.onTouch()
    }
  }

  public onBlur(): void {
    this.control.setValue(this.items.find(c => c.id === this.id)?.value ?? null)
  }

  public registerOnChange(fn: () => void): void {
    this.onChange = fn
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn
  }
}
