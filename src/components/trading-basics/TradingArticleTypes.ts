import type React from "react"

export type Section = {
  title: string
  content: React.ReactNode
}

export type Article = {
  id: string
  badge: string
  title: string
  summary: string
  sections: Section[]
}
