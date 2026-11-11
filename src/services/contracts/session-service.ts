import type { AdminUser } from '@/types'

export interface SessionService {
  getCurrentAdmin(): Promise<AdminUser>
}
