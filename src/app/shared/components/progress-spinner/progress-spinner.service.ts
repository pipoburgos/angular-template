import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ProgressSpinnerService {
  private readonly showSrc = new BehaviorSubject<boolean>(false)
  public show$ = this.showSrc.asObservable()

  public show(): void {
    this.showSrc.next(true)
  }

  public hide(): void {
    this.showSrc.next(false)
  }
}
