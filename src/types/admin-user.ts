import type { EntityId } from './common'

export type AdminRole = 'super_admin' | 'operations' | 'support' | 'viewer'

export interface AdminUser {
  id: EntityId
  name: string
  email: string
  role: AdminRole
  avatarUrl?: string
}
