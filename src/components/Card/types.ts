import { ReactNode } from 'react'

export type CardComponentProps = {
  children: ReactNode
}

export type CardProps = {
  x?: number
  y?: number
  scale?: boolean
}
