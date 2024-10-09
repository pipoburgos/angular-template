import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { AuthService } from '../services/auth.service'

export const roleGuard: CanActivateFn = route => {
  const authService = inject(AuthService)
  const role = route.data['role']
  return authService.isInRole(role)
}
