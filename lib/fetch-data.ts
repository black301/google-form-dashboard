import Papa from "papaparse"

interface FormResponse {
  [key: string]: string
}

export async function fetchAndParseCSV(url: string): Promise<FormResponse[]> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()

    return new Promise<FormResponse[]>((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Filter out rows that are completely empty
          const filteredData = (results.data as FormResponse[]).filter((row: FormResponse) => {
            return Object.values(row).some((value) => value !== "")
          })
          resolve(filteredData)
        },
        error: (error: Error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    throw error
  }
}
