"use client"

import { Input } from "@/components/ui/input"

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  totalEntries: number
  loading: boolean
}

export function Filters({ searchTerm, setSearchTerm, totalEntries, loading }: FiltersProps) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>
      <div>Total Entries: {totalEntries}</div>
    </div>
  )
}
