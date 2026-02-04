import { useState } from 'react'
import { type BookletLayout, type Booklet, type PageNumber } from '../utils/bookletCalculator'
import { Eye, ChevronUp } from 'lucide-react'

interface SheetCardProps {
  sheet: PageNumber[]
  sheetIndex: number
  layoutRangeStart: number
}

function SheetCard({ sheet, sheetIndex, layoutRangeStart }: SheetCardProps) {
  return (
    <div className="flex flex-col mb-4 bg-white border border-stone-200 rounded p-3 text-sm last:mb-0">
      <div className="text-xs font-bold text-stone-500 mb-2 uppercase tracking-wide">Sheet {sheetIndex + 1}</div>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <div className="flex-1 bg-stone-50 p-2 rounded border border-stone-100 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-stone-400 w-10">Front</div>
          <div className="flex flex-1 justify-center gap-2">
            {sheet.slice(0, sheet.length / 2).map((page, idx) => {
              const absolutePage = page === null ? null : layoutRangeStart + page - 1
              return (
                <span
                  key={idx}
                  className={`w-8 h-8 flex items-center justify-center rounded text-stone-900 font-serif font-bold border ${absolutePage === null ? 'border-dashed border-stone-300 text-stone-300 bg-stone-50' : 'bg-white border-stone-200 shadow-sm'}`}
                >
                  {absolutePage === null ? '—' : absolutePage}
                </span>
              )
            })}
          </div>
        </div>
        <div className="flex-1 bg-stone-50 p-2 rounded border border-stone-100 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-stone-400 w-10 text-right">Back</div>
          <div className="flex flex-1 justify-center gap-2">
            {sheet.slice(sheet.length / 2).map((page, idx) => {
              const absolutePage = page === null ? null : layoutRangeStart + page - 1
              return (
                <span
                  key={idx}
                  className={`w-8 h-8 flex items-center justify-center rounded text-stone-900 font-serif font-bold border ${absolutePage === null ? 'border-dashed border-stone-300 text-stone-300 bg-stone-50' : 'bg-stone-100 border-stone-200'}`}
                >
                  {absolutePage === null ? '—' : absolutePage}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

interface BookletCardProps {
  booklet: Booklet
  layout: BookletLayout
  layoutRangeStart: number
}

function BookletCard({ booklet, layout, layoutRangeStart }: BookletCardProps) {
  const pagesPerBooklet = layout.pagesPerBooklet || booklet.pages || 0
  const relativeRangeStart = (booklet.index - 1) * pagesPerBooklet + 1
  const relativeRangeEnd = relativeRangeStart + pagesPerBooklet - 1
  // Calculate potential absolute page range for display
  const absStart = layoutRangeStart + relativeRangeStart - 1
  const absEnd = layoutRangeStart + relativeRangeEnd - 1

  return (
    <div className="bg-white border border-stone-200 rounded-lg p-5 paper-shadow-sm mb-6 last:mb-0">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 pb-3 border-b border-stone-100 gap-2">
        <div>
          <div className="font-serif text-xl font-bold text-stone-800">Booklet {booklet.index}</div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-stone-500 mt-1">
            <span className="font-medium bg-stone-100 px-2 py-0.5 rounded text-stone-600">
              {booklet.sheetCount} sheets
            </span>
            <span>•</span>
            <span>
              pages {absStart}–{absEnd}
            </span>
          </div>
        </div>
        {booklet.blankPages > 0 && (
          <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full font-bold border border-amber-100 whitespace-nowrap">
            {booklet.blankPages} blank page{booklet.blankPages === 1 ? '' : 's'}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {booklet.sheets.map((sheet, sheetIndex) => (
          <SheetCard
            key={sheetIndex}
            sheet={sheet}
            sheetIndex={sheetIndex}
            layoutRangeStart={layoutRangeStart}
          />
        ))}
      </div>
    </div>
  )
}

interface BookletViewProps {
  layout: BookletLayout | null
  layoutRangeStart: number
}

export default function BookletView({ layout, layoutRangeStart }: BookletViewProps) {
  const [showAllBooklets, setShowAllBooklets] = useState(false)

  if (!layout?.booklets || layout.booklets.length === 0) {
    return null
  }

  const booklets = layout.booklets
  const totalBooklets = booklets.length

  // Determine which booklets to show
  let bookletsToDisplay: Booklet[]
  let hiddenCount = 0

  if (totalBooklets <= 2 || showAllBooklets) {
    // Show all if there are 2 or fewer, or if expanded
    bookletsToDisplay = booklets
  } else {
    // Show first and last only
    bookletsToDisplay = [booklets[0], booklets[totalBooklets - 1]]
    hiddenCount = totalBooklets - 2
  }

  return (
    <div className="bg-stone-50/50 p-6 rounded-xl border border-stone-200/50 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-serif font-bold text-stone-800">4. Visual Proof</h2>
        <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">
          {totalBooklets} Total Booklets
        </div>
      </div>

      <div className="space-y-6">
        {bookletsToDisplay.map((booklet, index) => {
          // If we are hiding booklets, we need to insert a "gap" indicator
          const isGap = hiddenCount > 0 && index === 1;

          return (
            <div key={booklet.index}>
              {isGap && (
                <div className="flex flex-col items-center justify-center my-8 text-stone-400 gap-2">
                  <div className="h-8 w-0.5 bg-stone-300"></div>
                  <span className="text-sm font-serif italic text-stone-500">
                    ... {hiddenCount} intermediate booklets hidden ...
                  </span>
                  <div className="h-8 w-0.5 bg-stone-300"></div>
                </div>
              )}
              <BookletCard
                booklet={booklet}
                layout={layout}
                layoutRangeStart={layoutRangeStart}
              />
            </div>
          )
        })}
      </div>

      {hiddenCount > 0 && (
        <div className="mt-8 text-center border-t border-stone-200 pt-6">
          <button
            onClick={() => setShowAllBooklets(!showAllBooklets)}
            className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-600 font-medium py-2 px-4 rounded-full border border-stone-300 shadow-sm transition-all hover:shadow-md"
          >
            {showAllBooklets ? (
              <>
                <ChevronUp size={16} /> Show Less
              </>
            ) : (
              <>
                <Eye size={16} /> Show All {totalBooklets} Booklets
              </>
            )}
          </button>
        </div>
      )}

      {totalBooklets > 2 && showAllBooklets && (
        <div className="mt-8 text-center pt-6">
          <button
            onClick={() => setShowAllBooklets(false)}
            className="text-stone-400 hover:text-stone-600 text-sm font-medium underline decoration-stone-300 underline-offset-4"
          >
            Collapse View
          </button>
        </div>
      )}
    </div>
  )
}
