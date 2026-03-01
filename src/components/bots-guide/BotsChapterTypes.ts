import type React from "react"
import type { Relevance2026 } from "@/components/Relevance2026Badge"

export type Section = { title: string; content: React.ReactNode }
export type Chapter = { id: string; badge: string; title: string; summary: string; sections: Section[]; relevance2026?: Relevance2026 }