"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Copy, Download, FileText, Clock, Type, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { PDFPreview } from "@/components/pdf-preview"
import { MarkdownViewer } from "@/components/markdown-viewer"
import { ComparisonView } from "@/components/comparison-view"

interface ResultsViewerProps {
  file: File
  data: any
  model: string
  onBack: () => void
}

export function ResultsViewer({ file, data, model, onBack }: ResultsViewerProps) {
  const [activeTab, setActiveTab] = useState("annotations")
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(data.markdown || JSON.stringify(data, null, 2))
    toast({
      title: "Copied to clipboard",
      description: "The extracted content has been copied",
    })
  }

  const handleDownload = () => {
    const blob = new Blob([data.markdown || JSON.stringify(data, null, 2)], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${file.name.replace(".pdf", "")}-extracted.md`
    a.click()
    URL.revokeObjectURL(url)
    toast({
      title: "Download started",
      description: "Your markdown file is being downloaded",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm"
      >
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-semibold text-foreground">{file.name}</h2>
                <p className="text-xs text-muted-foreground">Processed with {model.toUpperCase()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button variant="default" size="sm" onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-border bg-card/30"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Extraction Time</p>
                <p className="font-semibold text-foreground">{data.metrics?.extractionTime || "2.4s"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Type className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Word Count</p>
                <p className="font-semibold text-foreground">{data.metrics?.wordCount || "1,247"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confidence Score</p>
                <p className="font-semibold text-foreground">{data.metrics?.confidence || "94.2%"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto px-6 pt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="annotations">Annotations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="annotations" className="mt-0">
            <motion.div
              key="annotations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6 lg:grid-cols-2"
            >
              {/* Left: PDF Preview */}
              <Card className="overflow-hidden border-border bg-card">
                <PDFPreview file={file} annotations={data.annotations} />
              </Card>

              {/* Right: Markdown Output */}
              <Card className="overflow-hidden border-border bg-card">
                <MarkdownViewer content={data.markdown} />
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="comparison" className="mt-0">
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <ComparisonView data={data} />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
