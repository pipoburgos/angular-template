import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { ThemePalette } from '@angular/material/core'
import {
  ProgressSpinnerMode,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner'
import { ProgressSpinnerService } from './progress-spinner.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-progress-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {
  private readonly progressSpinnerService = inject(ProgressSpinnerService)

  public get show$(): Observable<boolean> {
    return this.progressSpinnerService.show$
  }

  public title = 'control'
  public color: ThemePalette = 'primary'
  public mode: ProgressSpinnerMode = 'indeterminate'
  public value = 50
}
