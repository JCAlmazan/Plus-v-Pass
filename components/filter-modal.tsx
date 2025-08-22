"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Filter } from "lucide-react"

interface FilterModalProps {
  title: string
  color: string
  filters: Array<{
    key: string
    label: string
    count: number
    active: boolean
  }>
  onFilterToggle: (key: string) => void
  multiSelect?: boolean
}

export function FilterModal({ title, color, filters, onFilterToggle, multiSelect = false }: FilterModalProps) {
  const [open, setOpen] = useState(false)

  const handleFilterClick = (key: string) => {
    onFilterToggle(key)
    if (!multiSelect) {
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 h-8 w-8 p-0 md:hidden bg-transparent">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter {title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter {title}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={filter.active ? "default" : "outline"}
              onClick={() => handleFilterClick(filter.key)}
              className={`justify-start text-sm ${
                filter.active
                  ? `bg-[${color}] hover:bg-[${color}]/90 text-white`
                  : `hover:bg-[${color}]/10 hover:text-[${color}] hover:border-[${color}]/30`
              }`}
              style={
                filter.active
                  ? {
                      backgroundColor: color,
                      borderColor: color,
                    }
                  : {}
              }
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>
        {multiSelect && (
          <div className="text-xs text-muted-foreground text-center">Tap multiple filters to combine them</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
