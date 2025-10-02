"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

interface MarkdownViewerProps {
  content?: string
}

export function MarkdownViewer({ content }: MarkdownViewerProps) {
  // Mock markdown content
  const mockContent =
    content ||
    `# Document Title

This is the extracted content from your PDF document. The OCR model has successfully identified and converted all text elements.

## Section 1: Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Key Points

- **Point 1**: Important information extracted from the document
- **Point 2**: Additional details with high confidence
- **Point 3**: Structured data successfully parsed

## Section 2: Data Analysis

| Metric | Value | Status |
|--------|-------|--------|
| Accuracy | 94.2% | ✓ High |
| Processing Time | 2.4s | ✓ Fast |
| Word Count | 1,247 | ✓ Complete |

## Section 3: Conclusion

The extraction process has completed successfully with high confidence scores across all sections. All text, tables, and structural elements have been preserved in the markdown output.

> **Note**: This is a sample output. Your actual extracted content will appear here after processing.
`

  return (
    <div className="flex h-[calc(100vh-20rem)] flex-col">
      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <h3 className="font-semibold text-foreground">Markdown Output</h3>
      </div>

      <ScrollArea className="flex-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none p-6"
        >
          <div className="space-y-4 text-foreground">
            {mockContent.split("\n").map((line, index) => {
              if (line.startsWith("# ")) {
                return (
                  <h1 key={index} className="text-3xl font-bold text-foreground">
                    {line.replace("# ", "")}
                  </h1>
                )
              }
              if (line.startsWith("## ")) {
                return (
                  <h2 key={index} className="mt-6 text-2xl font-semibold text-foreground">
                    {line.replace("## ", "")}
                  </h2>
                )
              }
              if (line.startsWith("### ")) {
                return (
                  <h3 key={index} className="mt-4 text-xl font-semibold text-foreground">
                    {line.replace("### ", "")}
                  </h3>
                )
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={index} className="ml-4 text-foreground">
                    {line.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")}
                  </li>
                )
              }
              if (line.startsWith("> ")) {
                return (
                  <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    {line.replace("> ", "")}
                  </blockquote>
                )
              }
              if (line.startsWith("|")) {
                return null // Handle tables separately
              }
              if (line.trim() === "") {
                return <div key={index} className="h-2" />
              }
              return (
                <p key={index} className="leading-relaxed text-foreground">
                  {line}
                </p>
              )
            })}
          </div>
        </motion.div>
      </ScrollArea>
    </div>
  )
}
