"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface ComparisonViewProps {
  data: any
}

export function ComparisonView({ data }: ComparisonViewProps) {
  // Mock comparison data
  const comparison = {
    model1: {
      name: "DOTS OCR",
      content: `# Document Analysis Report

## Executive Summary
This document provides a comprehensive analysis of the quarterly performance metrics and strategic initiatives.

### Key Findings
- Revenue increased by 23% year-over-year
- Customer satisfaction scores improved to 4.8/5
- Market share expanded in three key regions

## Financial Overview
The financial performance exceeded expectations with strong growth across all segments.`,
    },
    model2: {
      name: "Surya",
      content: `# Document Analysis Report

## Executive Summary
This document provides a comprehensive analysis of the quarterly performance metrics and strategic initiatives.

### Key Findings
- Revenue increased by 24% year-over-year
- Customer satisfaction scores improved to 4.7/5
- Market share expanded in four key regions

## Financial Overview
The financial performance exceeded expectations with robust growth across all segments.`,
    },
    differences: [
      { line: 6, model1: "23%", model2: "24%", type: "number" },
      { line: 7, model1: "4.8/5", model2: "4.7/5", type: "number" },
      { line: 8, model1: "three key regions", model2: "four key regions", type: "text" },
      { line: 11, model1: "strong growth", model2: "robust growth", type: "text" },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Differences Summary */}
      <Card className="border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Detected Differences</h3>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {comparison.differences.length} differences found
          </Badge>
        </div>
        <div className="grid gap-3">
          {comparison.differences.map((diff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-semibold text-primary">
                {diff.line}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{comparison.model1.name}:</span>
                  <code className="rounded bg-destructive/20 px-2 py-0.5 text-sm text-destructive">{diff.model1}</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{comparison.model2.name}:</span>
                  <code className="rounded bg-primary/20 px-2 py-0.5 text-sm text-primary">{diff.model2}</code>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {diff.type}
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Side-by-Side Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Model 1 Output */}
        <Card className="border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="font-semibold text-foreground">{comparison.model1.name}</h3>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                {comparison.model1.content.split("\n").map((line, index) => {
                  const hasDiff = comparison.differences.some((d) => d.line === index + 1)
                  return (
                    <div key={index} className={`${hasDiff ? "bg-destructive/10 -mx-2 px-2 py-1 rounded" : ""}`}>
                      {line}
                    </div>
                  )
                })}
              </pre>
            </div>
          </ScrollArea>
        </Card>

        {/* Model 2 Output */}
        <Card className="border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-4 py-3">
            <h3 className="font-semibold text-foreground">{comparison.model2.name}</h3>
          </div>
          <ScrollArea className="h-[600px]">
            <div className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                {comparison.model2.content.split("\n").map((line, index) => {
                  const hasDiff = comparison.differences.some((d) => d.line === index + 1)
                  return (
                    <div key={index} className={`${hasDiff ? "bg-primary/10 -mx-2 px-2 py-1 rounded" : ""}`}>
                      {line}
                    </div>
                  )
                })}
              </pre>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
