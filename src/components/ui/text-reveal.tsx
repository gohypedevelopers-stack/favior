"use client"

import {
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from "react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
  children: string
}

export const TextReveal: FC<TextRevealProps> = ({ children, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  if (typeof children !== "string") {
    throw new Error("TextReveal: children must be a string")
  }

  // Parse Markdown **bold** syntax for selective emphasis
  const tokens: { text: string; isBold: boolean }[] = []
  const parts = children.split(/(\*\*.*?\*\*)/g)

  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2)
      const boldWords = boldText.split(/\s+/).filter(Boolean)
      for (const w of boldWords) {
        tokens.push({ text: w, isBold: true })
      }
    } else {
      const normalWords = part.split(/\s+/).filter(Boolean)
      for (const w of normalWords) {
        tokens.push({ text: w, isBold: false })
      }
    }
  }

  return (
    <div ref={targetRef} className={cn("relative z-0 min-h-[160vh]", className)}>
      <div
        className={
          "sticky top-0 mx-auto flex min-h-screen max-w-5xl items-center justify-center bg-transparent px-6 py-20"
        }
      >
        <p
          className={
            "flex flex-wrap justify-center text-center font-heading text-2xl uppercase leading-relaxed tracking-wide sm:text-3xl md:text-4xl lg:text-5xl"
          }
        >
          {tokens.map((token, i) => {
            const start = i / tokens.length
            const end = start + 1 / tokens.length
            return (
              <Word
                key={i}
                progress={scrollYProgress}
                range={[start, end]}
                isBold={token.isBold}
              >
                {token.text}
              </Word>
            )
          })}
        </p>
      </div>
    </div>
  )
}

interface WordProps {
  children: ReactNode
  progress: MotionValue<number>
  range: [number, number]
  isBold?: boolean
}

const Word: FC<WordProps> = ({ children, progress, range, isBold }) => {
  const opacity = useTransform(progress, range, [0, 1])

  return (
    <span className="relative mx-1.5 my-1 inline-block">
      {/* Unrevealed dimmed background word */}
      <span
        className={cn(
          "select-none opacity-20",
          isBold ? "font-extrabold text-[#0F0F10]" : "font-light text-neutral-400"
        )}
      >
        {children}
      </span>
      {/* Revealed animated word */}
      <motion.span
        style={{ opacity }}
        className={cn(
          "absolute inset-0 select-none",
          isBold ? "font-extrabold text-[#0F0F10]" : "font-medium text-[#0F0F10]"
        )}
      >
        {children}
      </motion.span>
    </span>
  )
}
