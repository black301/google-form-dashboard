"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react"
import { useState } from "react"

interface DataTableProps {
  data: any[]
  sortConfig: {
    key: string | null
    direction: "ascending" | "descending"
  }
  onSort: (key: string) => void
}

export function DataTable({ data, sortConfig, onSort }: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  const headers = Object.keys(data[0])

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage)

  // Format cell content based on type
  const formatCellContent = (header: string, content: any) => {
    if (!content) return "-"

    // Format based on header type
    if (header.toLowerCase() === "timestamp") {
      try {
        const date = new Date(content)
        return date.toLocaleString()
      } catch (e) {
        return content
      }
    }

    if (header.toLowerCase() === "email address" || header.toLowerCase().includes("email")) {
      return (
        <a href={`mailto:${content}`} className="text-primary hover:underline flex items-center">
          {content}
        </a>
      )
    }

    if (header.toLowerCase() === "linkedin" || header.toLowerCase().includes("linkedin")) {
      if (content.startsWith("http")) {
        return (
          <a
            href={content}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center"
          >
            {content.substring(0, 30)}... <ExternalLink className="ml-1 h-3 w-3" />
          </a>
        )
      }
      return content
    }

    if (header.toLowerCase() === "specialization") {
      return <Badge variant="outline">{content}</Badge>
    }

    // Truncate long text
    if (typeof content === "string" && content.length > 50) {
      return `${content.substring(0, 50)}...`
    }

    return content
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="cursor-pointer hover:bg-muted/50" onClick={() => onSort(header)}>
                    <div className="flex items-center space-x-1">
                      <span>{header}</span>
                      {sortConfig.key === header &&
                        (sortConfig.direction === "ascending" ? (
                          <ArrowUp className="h-4 w-4" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        ))}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`}>{formatCellContent(header, row[header])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = i + 1
              if (totalPages > 5) {
                if (currentPage > 3) {
                  pageNum = currentPage - 3 + i
                }
                if (currentPage > totalPages - 2) {
                  pageNum = totalPages - 4 + i
                }
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
