import { RequestHandler } from "express";
import { DocumentDesignResponse, DocumentDesignData } from "@shared/api";

// Mock data for different document types
const mockData: Record<string, DocumentDesignData[]> = {
  "1": [
    // Anchor
    {
      id: "anchor_1",
      name: "Standard Anchor Template",
      description: "Default anchor document template with standard layout",
      createdDate: "2025-01-10",
      status: "Active",
      version: "1.2.0",
    },
    {
      id: "anchor_2",
      name: "Custom Anchor Layout",
      description: "Customized anchor template for specific use cases",
      createdDate: "2025-01-08",
      status: "Draft",
      version: "2.0.0",
    },
  ],
  "2": [
    // MasterList
    {
      id: "master_1",
      name: "Primary Master List",
      description: "Main master list template for data organization",
      createdDate: "2025-01-12",
      status: "Active",
      version: "1.5.2",
    },
    {
      id: "master_2",
      name: "Secondary Master List",
      description: "Alternative master list for specialized data",
      createdDate: "2025-01-09",
      status: "Active",
      version: "1.3.1",
    },
    {
      id: "master_3",
      name: "Archived Master List",
      description: "Previous version of master list template",
      createdDate: "2025-01-05",
      status: "Archived",
      version: "1.0.0",
    },
  ],
  "11": [
    // Collateral
    {
      id: "collateral_1",
      name: "Marketing Collateral",
      description: "Templates for marketing and promotional materials",
      createdDate: "2025-01-11",
      status: "Active",
      version: "2.1.0",
    },
  ],
  "14": [
    // View
    {
      id: "view_1",
      name: "Standard View Template",
      description: "Basic view template for document display",
      createdDate: "2025-01-13",
      status: "Active",
      version: "1.4.0",
    },
    {
      id: "view_2",
      name: "Advanced View Template",
      description: "Enhanced view template with additional features",
      createdDate: "2025-01-07",
      status: "Active",
      version: "2.2.1",
    },
  ],
  "3": [
    // Report
    {
      id: "report_1",
      name: "Financial Report Template",
      description: "Standard financial reporting template",
      createdDate: "2025-01-14",
      status: "Active",
      version: "1.1.0",
    },
    {
      id: "report_2",
      name: "Performance Report Template",
      description: "KPI and performance metrics reporting",
      createdDate: "2025-01-12",
      status: "Active",
      version: "1.0.5",
    },
  ],
  "4": [
    // Form
    {
      id: "form_1",
      name: "Contact Form Template",
      description: "Basic contact information form",
      createdDate: "2025-01-15",
      status: "Active",
      version: "2.0.0",
    },
    {
      id: "form_2",
      name: "Survey Form Template",
      description: "Interactive survey and feedback form",
      createdDate: "2025-01-10",
      status: "Draft",
      version: "1.5.0",
    },
  ],
};

export const handleDocumentDesigns: RequestHandler = (req, res) => {
  try {
    const { type } = req.params;

    // Validate document type
    if (!type || type === "0") {
      return res.json({
        documentType: type || "0",
        data: [],
      } as DocumentDesignResponse);
    }

    // Get data for the specified type
    const data = mockData[type] || [];

    const response: DocumentDesignResponse = {
      documentType: type,
      data: data,
    };

    // Simulate API delay
    setTimeout(() => {
      res.json(response);
    }, 500);
  } catch (error) {
    console.error("Error fetching document designs:", error);
    res.status(500).json({
      error: "Failed to fetch document designs",
    });
  }
};
