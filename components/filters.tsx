"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface FiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  totalEntries: number
  loading: boolean
}

export function Filters({ searchTerm, setSearchTerm, totalEntries, loading }: FiltersProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search responses..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="text-sm text-muted-foreground">
        {loading ? (
          <Skeleton className="h-5 w-32" />
        ) : (
          `Showing ${totalEntries} ${totalEntries === 1 ? "entry" : "entries"}`
        )}
      </div>
    </div>
  )
}
