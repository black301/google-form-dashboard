"use client"

import { useState, useEffect, useRef } from "react"
import { fetchAndParseCSV } from "@/lib/fetch-data"
import { DataTable } from "@/components/data-table"
import { Filters } from "@/components/filters"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define the link object type
interface LinkObject {
  url: string
  text: string
}

// Update FormResponse to handle both string and LinkObject types
interface FormResponse {
  [key: string]: string | LinkObject
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

  // Reference to store the interval ID for cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const loadData = async () => {
    try {
      const csvUrl =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vR2KXpX8_6FUj3Ks77B6WNJrw2QJlQnt0WWPSk2U6V1z8a1G5rwEnKNBqrnmT_9HZCoy5uREiZrs9uA/pub?gid=1596920951&single=true&output=csv"
      const parsedData = await fetchAndParseCSV(csvUrl)

      // Process the data to transform CV and LinkedIn fields into link objects
      const processedData = parsedData.map((item: Record<string, string>) => {
        const newItem: FormResponse = { ...item }

        // Convert CV and LinkedIn fields to link objects if they exist and are URLs
        if (newItem.CV && typeof newItem.CV === "string" && isValidURL(newItem.CV)) {
          newItem.CV = { url: newItem.CV, text: "View CV" }
        }

        if (newItem.LinkedIn && typeof newItem.LinkedIn === "string" && isValidURL(newItem.LinkedIn)) {
          newItem.LinkedIn = { url: newItem.LinkedIn, text: "View Profile" }
        }

        // Remove Timestamp and Email fields
        delete newItem.Timestamp
        delete newItem.Email

        return newItem
      })

      setData(processedData)

      // Apply current filters to the new data
      if (searchTerm.trim() === "") {
        setFilteredData(processedData)
      } else {
        filterData(processedData, searchTerm)
      }

      if (loading) setLoading(false)
    } catch (err) {
      setError("Failed to load data. Please try again later.")
      console.error(err)
      if (loading) setLoading(false)
    }
  }

  // Helper function to validate URLs
  const isValidURL = (str: string) => {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  // Function to filter data based on search term
  const filterData = (dataToFilter: FormResponse[], term: string) => {
    if (term.trim() === "") {
      return dataToFilter
    } else {
      const lowercasedTerm = term.toLowerCase()
      const filtered = dataToFilter.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          // Skip filtering on link objects
          if (typeof value === "object" && value !== null && "text" in value) {
            return value.text.toString().toLowerCase().includes(lowercasedTerm)
          }
          return typeof value === "string" && value.toLowerCase().includes(lowercasedTerm)
        })
      })
      setFilteredData(filtered)
      return filtered
    }
  }

  useEffect(() => {
    // Initial data load
    loadData()

    // Set up polling interval (every 30 seconds)
    pollingIntervalRef.current = setInterval(() => {
      loadData()
    }, 30000) // 30 seconds

    // Clean up interval on component unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, []) // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Filter data when search term changes
    filterData(data, searchTerm)
  }, [searchTerm, data])

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })

    const sortedData = [...filteredData].sort((a, b) => {
      // Handle sorting for link objects
      const valueA =
        typeof a[key] === "object" && a[key] !== null && "text" in a[key] ? (a[key] as LinkObject).text : a[key]
      const valueB =
        typeof b[key] === "object" && b[key] !== null && "text" in b[key] ? (b[key] as LinkObject).text : b[key]

      if (valueA < valueB) return direction === "ascending" ? -1 : 1
      if (valueA > valueB) return direction === "ascending" ? 1 : -1
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
