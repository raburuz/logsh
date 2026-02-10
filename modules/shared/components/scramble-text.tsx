"use client"

import { useEffect, useState, useRef } from "react"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"

interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 30,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState("")
  const [started, setStarted] = useState(false)
  const frameRef = useRef(0)

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return

    let settled = 0
    let frame = 0

    function tick() {
      frame++
      if (frame % 2 === 0 && settled < text.length) {
        settled++
      }

      const result = text
        .split("")
        .map((char, i) => {
          if (i < settled) return char
          if (char === " ") return " "
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join("")

      setDisplay(result)

      if (settled < text.length) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [started, text, speed])

  return (
    <span className={className}>
      {started ? display : text?.replace(/./g, "\u00A0")}
    </span>
  )
}
