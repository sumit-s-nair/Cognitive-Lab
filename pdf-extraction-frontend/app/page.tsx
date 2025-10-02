"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { ResultsViewer } from "@/components/results-viewer"

type Model = "dots-ocr" | "surya" | "mineru" | "docling"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [model, setModel] = useState<Model>("dots-ocr")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [extractedData, setExtractedData] = useState<any>(null)
  const { toast } = useToast()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && droppedFile.type === "application/pdf") {
        setFile(droppedFile)
        toast({
          title: "File selected",
          description: `${droppedFile.name} is ready to upload`,
        })
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile)
      toast({
        title: "File selected",
        description: `${selectedFile.name} is ready to upload`,
      })
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      })
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setExtractedData(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("model", model)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setExtractedData(data)

      toast({
        title: "Extraction complete",
        description: "Your PDF has been processed successfully",
      })
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (extractedData && file) {
    return <ResultsViewer file={file} data={extractedData} model={model} onBack={() => setExtractedData(null)} />
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground">PDF Document Extraction</h1>
          <p className="text-lg text-muted-foreground">
            Upload your PDF and select an OCR model to extract text and data
          </p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Upload Document</CardTitle>
            <CardDescription className="text-muted-foreground">
              Drag and drop your PDF file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center gap-4 text-center">
                {file ? (
                  <>
                    <FileText className="h-12 w-12 text-primary" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">Drop your PDF here or click to browse</p>
                      <p className="text-sm text-muted-foreground">Supports PDF files up to 50MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select OCR Model</label>
              <Select value={model} onValueChange={(value) => setModel(value as Model)} disabled={isUploading}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dots-ocr">DOTS OCR</SelectItem>
                  <SelectItem value="surya">Surya</SelectItem>
                  <SelectItem value="mineru">MinerU</SelectItem>
                  <SelectItem value="docling">Docling</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the extraction model that best fits your document type
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Processing...</span>
                  <span className="font-medium text-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Upload Button */}
            <Button onClick={handleUpload} disabled={!file || isUploading} className="w-full" size="lg">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Extract Text
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
