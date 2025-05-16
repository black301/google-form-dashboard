"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp } from "lucide-react"

interface LinkObject {
  url: string
  text: string
}

interface SortConfig {
  key: string | null
  direction: "ascending" | "descending"
}

interface DataTableProps {
  data: Record<string, string | LinkObject>[]
  sortConfig: SortConfig
  onSort: (key: string) => void
}

export function DataTable({ data, sortConfig, onSort }: DataTableProps) {
  if (!data.length) {
    return <div className="text-center py-8">No data found</div>
  }

  // Get all unique keys from the data
  const columns = Object.keys(data[0] || {})

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="cursor-pointer" onClick={() => onSort(column)}>
                <div className="flex items-center space-x-1">
                  <span>{column}</span>
                  {sortConfig.key === column && (
                    <span className="ml-1">
                      {sortConfig.direction === "ascending" ? (
                        <ArrowUp className="h-4 w-4" />
                      ) : (
                        <ArrowDown className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((column) => (
                <TableCell key={`${rowIndex}-${column}`}>
                  {typeof row[column] === "object" && row[column] !== null && "url" in row[column] ? (
                    <a
                      href={(row[column] as LinkObject).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {(row[column] as LinkObject).text}
                    </a>
                  ) : (
                    row[column]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
