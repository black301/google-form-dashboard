import Papa from "papaparse"

export async function fetchAndParseCSV(url: string): Promise<Record<string, string>[]> {
  try {
    const response = await fetch(url, { cache: "no-store" }) // Disable caching to always get fresh data
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(results.data as Record<string, string>[])
        },
        error: (error : Error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error)
    throw error
  }
}
