'use client'
import { Search, X } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

interface SearchInputProps {
  placeholder?: string
  onSearch: (term: string) => void
  defaultValue?: string
}

export function SearchInput({ placeholder = 'Buscar familia...', onSearch, defaultValue = '' }: SearchInputProps) {
  const [value, setValue] = useState(defaultValue)

  const debouncedSearch = useCallback(
    (term: string) => {
      const t = setTimeout(() => onSearch(term), 200)
      return () => clearTimeout(t)
    },
    [onSearch]
  )

  useEffect(() => {
    const cleanup = debouncedSearch(value)
    return cleanup
  }, [value, debouncedSearch])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b7a99] pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full pl-9 pr-8 py-2.5 bg-white border border-[#dde3f0] rounded-lg text-sm text-[#0f1e35] placeholder:text-[#6b7a99] focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/40 transition-all"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7a99] hover:text-[#0f1e35] transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
