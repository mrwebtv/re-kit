import type { Access, FieldAccess, Where } from 'payload'

type U = { role?: string | null; agent?: number | { id: number } | null } | null | undefined

/** Users without a role (accounts created before roles existed) count as admins. */
export const isAdminUser = (u: U) => Boolean(u) && u!.role !== 'agent'
export const isAgentUser = (u: U) => Boolean(u) && u!.role === 'agent'
export const agentIdOf = (u: U) => (u?.agent && typeof u.agent === 'object' ? u.agent.id : (u?.agent as number | undefined)) ?? -1

export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user as U)
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user as U)
export const loggedIn: Access = ({ req: { user } }) => Boolean(user)

/** Admins: everything. Agents: only documents whose `field` points at their agent profile. */
export const adminOrOwnAgent =
  (field: string): Access =>
  ({ req: { user } }) => {
    if (isAdminUser(user as U)) return true
    if (isAgentUser(user as U)) return { [field]: { equals: agentIdOf(user as U) } } as Where
    return false
  }
