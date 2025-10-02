"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Annotation {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  type: "text" | "table" | "image"
}

interface PDFPreviewProps {
  file: File
  annotations?: Annotation[]
}

export function PDFPreview({ file, annotations = [] }: PDFPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("")
  const [zoom, setZoom] = useState(100)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPdfUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Mock annotations
  const mockAnnotations: Annotation[] = annotations.length
    ? annotations
    : [
        { id: "1", x: 10, y: 15, width: 80, height: 8, text: "Document Title", type: "text" },
        { id: "2", x: 10, y: 30, width: 80, height: 25, text: "Main content paragraph", type: "text" },
        { id: "3", x: 10, y: 60, width: 40, height: 20, text: "Data table", type: "table" },
      ]

  return (
    <div className="flex h-[calc(100vh-20rem)] flex-col">
      <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-3">
        <h3 className="font-semibold text-foreground">PDF Preview</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="min-w-[3rem] text-center text-sm text-muted-foreground">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 bg-muted/10">
        <div className="flex min-h-full items-center justify-center p-6">
          <div className="relative" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
            {/* PDF Placeholder remember to use react-pdf later */}
            <div className="relative h-[800px] w-[600px] rounded-lg border border-border bg-white shadow-lg">
              <div className="p-8">
                <div className="mb-6 h-8 w-3/4 rounded bg-gray-200" />
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-5/6 rounded bg-gray-100" />
                </div>
                <div className="mt-8 space-y-3">
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                  <div className="h-4 w-4/5 rounded bg-gray-100" />
                </div>
                <div className="mt-8 h-40 w-full rounded border-2 border-dashed border-gray-200 bg-gray-50" />
              </div>

              {/* Annotation Overlays */}
              {mockAnnotations.map((annotation, index) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute cursor-pointer rounded border-2 border-primary bg-primary/10 transition-all hover:bg-primary/20"
                  style={{
                    left: `${annotation.x}%`,
                    top: `${annotation.y}%`,
                    width: `${annotation.width}%`,
                    height: `${annotation.height}%`,
                  }}
                  title={annotation.text}
                >
                  <div className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
