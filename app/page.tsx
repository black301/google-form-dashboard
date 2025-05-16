"use client"

import { useState, useEffect } from "react"
import { fetchAndParseCSV } from "@/lib/fetch-data"
import { DataTable } from "@/components/data-table"
import { Filters } from "@/components/filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface FormResponse {
  [key: string]: string
}

export default function Home() {
  const [data, setData] = useState<FormResponse[]>([])
  const [filteredData, setFilteredData] = useState<FormResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string | null
    direction: "ascending" | "descending"
  }>({ key: "Timestamp", direction: "descending" })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const csvUrl =
          "https://docs.google.com/sheets/d/e/2PACX-1vR2KXpX8_6FUj3Ks77B6WNJrw2QJlQnt0WWPSk2U6V1z8a1G5rwEnKNBqrnmT_9HZCoy5uREiZrs9uA/pub?gid=1596920951&single=true&output=csv"
        const parsedData = await fetchAndParseCSV(csvUrl)
        setData(parsedData)
        setFilteredData(parsedData)
      } catch (err) {
        setError("Failed to load data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    // Filter data based on search term
    if (searchTerm.trim() === "") {
      setFilteredData(data)
    } else {
      const lowercasedTerm = searchTerm.toLowerCase()
      const filtered = data.filter((item) => {
        return Object.values(item).some((value) => value && value.toString().toLowerCase().includes(lowercasedTerm))
      })
      setFilteredData(filtered)
    }
  }, [searchTerm, data])

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })

    setFilteredData(sortedData)
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Form Responses Dashboard</h1>
          <p className="text-muted-foreground">View and manage all your Google Form submissions in one place.</p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Filters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalEntries={filteredData.length}
          loading={loading}
        />

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <DataTable data={filteredData} sortConfig={sortConfig} onSort={handleSort} />
        )}
      </div>
    </main>
  )
}
