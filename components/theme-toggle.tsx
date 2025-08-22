"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 group overflow-hidden bg-transparent"
        disabled
      >
        <div className="w-[1.2rem] h-[1.2rem] flex items-center justify-center">
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        </div>
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed top-4 right-4 z-50 group overflow-hidden"
    >
      <div className="relative w-[1.2rem] h-[1.2rem] flex items-center justify-center">
        <Sun
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100 group-hover:rotate-12"
          }`}
        />
        <Moon
          className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ease-in-out ${
            isDark ? "rotate-0 scale-100 opacity-100 group-hover:-rotate-12" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
