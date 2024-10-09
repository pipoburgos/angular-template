import type { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { ProgressSpinnerService } from '../components/progress-spinner/progress-spinner.service'
import { finalize } from 'rxjs'
import { generateGuid } from '@shared'

let pendingRequests: string[] = []
export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(ProgressSpinnerService)
  spinner.show()
  const reqId = generateGuid()
  pendingRequests.push(reqId)
  return next(req).pipe(
    finalize(() => {
      pendingRequests = pendingRequests.filter(id => id !== reqId)
      if (!pendingRequests.length) {
        spinner.hide()
      }
    }),
  )
}
