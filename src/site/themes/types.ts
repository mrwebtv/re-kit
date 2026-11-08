import type { Agent, Property, SiteSetting } from '@/payload-types'
import type { ReactNode } from 'react'

export type HomeProps = { s: SiteSetting; featured: Property[]; latest: Property[]; agents: Agent[] }
export type CardProps = { p: Property; s: SiteSetting; index?: number }

export type ThemeKit = {
  id: string
  fonts: string
  defaultAccent: string
  Header: (props: { s: SiteSetting; overlay?: boolean }) => ReactNode
  Footer: (props: { s: SiteSetting }) => ReactNode
  Home: (props: HomeProps) => ReactNode
  Card: (props: CardProps) => ReactNode
  /** 'rows' renders listings as an index table instead of a card grid */
  listLayout?: 'grid' | 'rows'
}
