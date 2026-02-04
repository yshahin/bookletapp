import { Upload, FileText, Check } from 'lucide-react';

interface FileUploadProps {
  pdfFile: File | null
  totalPages: number
  loading: boolean
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload({ pdfFile, totalPages, loading, onFileUpload }: FileUploadProps) {
  return (
    <div className="bg-white p-6 rounded-xl paper-shadow border border-stone-100">
      <h2 className="text-lg font-serif font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">1. Source File</h2>

      <div className="relative">
        <input
          type="file"
          accept=".pdf"
          onChange={onFileUpload}
          id="pdf-upload"
          className="hidden"
        />
        <label
          htmlFor="pdf-upload"
          className={`
            flex flex-col items-center justify-center w-full h-40
            border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300
            ${pdfFile
              ? 'border-green-200 bg-green-50/50 hover:bg-green-50'
              : 'border-stone-300 bg-stone-50 hover:bg-stone-100 hover:border-stone-400'
            }
          `}
        >
          {loading ? (
            <div className="flex flex-col items-center animate-pulse text-stone-500">
              <FileText className="mb-2 w-8 h-8 opacity-50" />
              <span className="font-medium">Parsing PDF Structure...</span>
            </div>
          ) : pdfFile ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={24} />
              </div>
              <span className="block font-bold text-stone-800 text-lg mb-1">{pdfFile.name}</span>
              <span className="text-sm font-medium text-stone-500 bg-white px-3 py-1 rounded-full border border-stone-200 shadow-sm">
                {totalPages} Pages detected
              </span>
              <p className="mt-4 text-xs text-stone-400 font-medium hover:text-stone-600 transition-colors">
                Click to replace file
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-stone-500">
              <div className="w-12 h-12 bg-stone-200 text-stone-600 rounded-full flex items-center justify-center mb-3">
                <Upload size={24} />
              </div>
              <span className="font-bold text-lg text-stone-700">Upload PDF</span>
              <span className="text-sm mt-1">or drag and drop here</span>
            </div>
          )}
        </label>
      </div>
    </div>
  )
}
