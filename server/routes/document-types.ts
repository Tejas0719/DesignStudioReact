import { RequestHandler } from "express";
import { DocumentTypesResponse, DocumentType } from "@shared/api";

// Mock data - in real scenario this would come from database
const mockDocumentTypes: DocumentType[] = [
  {
    value: "0",
    label: "--Select--",
    description: "Please select a document type",
  },
  {
    value: "1",
    label: "Anchor",
    description: "Standard anchor document templates",
  },
  {
    value: "2",
    label: "MasterList",
    description: "Master list document templates",
  },
  {
    value: "11",
    label: "Collateral",
    description: "Marketing and promotional materials",
  },
  {
    value: "14",
    label: "View",
    description: "Document view templates",
  },
  {
    value: "3",
    label: "Report",
    description: "Business report templates",
  },
  {
    value: "4",
    label: "Form",
    description: "Interactive form templates",
  },
];

export const handleDocumentTypes: RequestHandler = (req, res) => {
  try {
    const response: DocumentTypesResponse = {
      types: mockDocumentTypes,
    };

    // Simulate API delay
    setTimeout(() => {
      res.json(response);
    }, 300);
  } catch (error) {
    console.error("Error fetching document types:", error);
    res.status(500).json({
      error: "Failed to fetch document types",
    });
  }
};
