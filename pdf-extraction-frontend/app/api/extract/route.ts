import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const model = formData.get("model") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Invalid file type. Please upload a PDF." }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResponse = {
      success: true,
      model: model,
      filename: file.name,
      fileSize: file.size,
      markdown: `# Document Analysis Report

## Executive Summary
This document provides a comprehensive analysis of the quarterly performance metrics and strategic initiatives for Q4 2024.

### Key Findings
- **Revenue Growth**: Increased by 23% year-over-year
- **Customer Satisfaction**: Improved to 4.8/5 rating
- **Market Expansion**: Successfully expanded in three key regions
- **Operational Efficiency**: Reduced costs by 15%

## Financial Overview
The financial performance exceeded expectations with strong growth across all business segments. Total revenue reached $12.4M, representing a significant milestone for the organization.

### Revenue Breakdown
| Category | Q4 2024 | Q3 2024 | Growth |
|----------|---------|---------|--------|
| Product Sales | $8.2M | $6.8M | +20.6% |
| Services | $3.1M | $2.4M | +29.2% |
| Subscriptions | $1.1M | $0.9M | +22.2% |

## Strategic Initiatives
Our strategic initiatives have shown promising results:

1. **Digital Transformation**: Successfully migrated 85% of operations to cloud infrastructure
2. **Customer Experience**: Launched new self-service portal with 92% adoption rate
3. **Product Innovation**: Released three major product updates with positive market reception

## Conclusion
The quarter demonstrated strong performance across all key metrics. The team's dedication and strategic focus have positioned us well for continued growth in 2025.

> **Note**: All figures are preliminary and subject to final audit review.`,
      annotations: [
        { id: "1", x: 10, y: 8, width: 80, height: 6, text: "Document Analysis Report", type: "text" as const },
        { id: "2", x: 10, y: 18, width: 80, height: 4, text: "Executive Summary", type: "text" as const },
        { id: "3", x: 10, y: 25, width: 80, height: 15, text: "Key findings section", type: "text" as const },
        { id: "4", x: 10, y: 45, width: 80, height: 20, text: "Revenue breakdown table", type: "table" as const },
        { id: "5", x: 10, y: 70, width: 80, height: 12, text: "Strategic initiatives", type: "text" as const },
      ],
      metrics: {
        extractionTime: "2.4s",
        wordCount: "1,247",
        confidence: "94.2%",
        pages: 5,
        tables: 1,
        images: 0,
      },
      processingTime: "2.4s",
      metadata: {
        title: "Q4 2024 Analysis Report",
        author: "Business Intelligence Team",
        creationDate: new Date().toISOString(),
      },
    }

    return NextResponse.json(mockResponse)
  } catch (error) {
    console.error("[v0] Error processing file:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
