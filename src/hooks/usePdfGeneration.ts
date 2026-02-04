import { useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import type { BookletLayout } from '../utils/bookletCalculator'

export function useBookletPdfGenerator(pdfData: ArrayBuffer | null, layout: BookletLayout | null) {
  return useCallback(async () => {
    if (!pdfData || !layout || !layout.sequence?.length) {
      throw new Error('A PDF with a generated layout is required.')
    }

    const sourcePdf = await PDFDocument.load(pdfData)
    const bookletPdf = await PDFDocument.create()

    let defaultSize: [number, number] = [612, 792]
    if (sourcePdf.getPageCount() > 0) {
      const { width, height } = sourcePdf.getPage(0).getSize()
      defaultSize = [width, height]
    }

    const pageRangeOffset = Math.max(0, (layout.rangeStart ?? 1) - 1)

    // Optimize: Collect all valid page indices to copy in one batch operation
    // this is significantly faster than calling copyPages for each page
    const indicesToCopy: number[] = []

    // First pass: identify valid pages
    for (const pageNum of layout.sequence) {
      if (pageNum !== null) {
        const absoluteIndex = pageRangeOffset + pageNum - 1
        if (absoluteIndex >= 0 && absoluteIndex < sourcePdf.getPageCount()) {
          indicesToCopy.push(absoluteIndex)
        }
      }
    }

    // Batch copy
    const copiedPages = await bookletPdf.copyPages(sourcePdf, indicesToCopy)

    // Second pass: construct the booklet
    let copiedPageIndex = 0
    for (const pageNum of layout.sequence) {
      if (pageNum === null) {
        bookletPdf.addPage(defaultSize)
        continue
      }

      const absoluteIndex = pageRangeOffset + pageNum - 1
      if (absoluteIndex >= 0 && absoluteIndex < sourcePdf.getPageCount()) {
        bookletPdf.addPage(copiedPages[copiedPageIndex])
        copiedPageIndex++
      } else {
        // Page out of range or invalid, insert blank
        bookletPdf.addPage(defaultSize)
      }
    }

    return bookletPdf.save()
  }, [layout, pdfData])
}

export function downloadPdfBlob(pdfBytes: Uint8Array, filename: string): void {
  const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
