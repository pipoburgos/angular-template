import { Component } from '@angular/core'
import { MatDialogModule } from '@angular/material/dialog'
import { RouterOutlet } from '@angular/router'
import {
  BreadcrumbsComponent,
  LoadingComponent,
  ProgressSpinnerComponent,
} from '@shared'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatDialogModule,
    BreadcrumbsComponent,
    LoadingComponent,
    ProgressSpinnerComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
