import type { Agent, Property } from '@/payload-types'
import type { ReactNode } from 'react'
import type { Site } from '../data'

export type HomeProps = { s: Site; featured: Property[]; latest: Property[]; agents: Agent[] }
export type CardProps = { p: Property; s: Site; index?: number; distance?: number }

export type ThemeKit = {
  id: string
  fonts: string
  defaultAccent: string
  Header: (props: { s: Site }) => ReactNode
  Footer: (props: { s: Site }) => ReactNode
  Home: (props: HomeProps) => ReactNode
  Card: (props: CardProps) => ReactNode
  /** 'rows' renders listings as an index table instead of a card grid */
  listLayout?: 'grid' | 'rows'
}
