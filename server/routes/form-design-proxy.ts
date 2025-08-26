import { RequestHandler } from "express";

const EXTERNAL_API_BASE = "https://localhost:7129/api/v2/";

export const handleDocumentDesignTypeProxy: RequestHandler = async (
  req,
  res,
) => {
  try {
    console.log("🔄 Proxying request to external FormDesign API...");

    const externalUrl = `${EXTERNAL_API_BASE}FormDesign/DocumentDesignType`;

    const response = await fetch(externalUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      // Ignore SSL certificate issues for localhost
      //@ts-ignore
      rejectUnauthorized: false,
    });

    if (!response.ok) {
      throw new Error(
        `External API responded with ${response.status}: ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("📦 External API response:", data);

    // Transform the response to match our expected format if needed
    // Assuming the external API returns an array of document types
    let transformedData;

    if (Array.isArray(data)) {
      // If it's already an array, use it directly
      transformedData = {
        types: data.map((item: any) => ({
          value: item.id || item.value || item.typeId,
          label: item.name || item.label || item.typeName,
          description: item.description || item.desc,
        })),
      };
    } else if (data.types || data.data || data.result) {
      // If it's wrapped in an object
      const items = data.types || data.data || data.result;
      transformedData = {
        types: items.map((item: any) => ({
          value: item.id || item.value || item.typeId,
          label: item.name || item.label || item.typeName,
          description: item.description || item.desc,
        })),
      };
    } else {
      // If format is unknown, try to use it as is
      transformedData = { types: data };
    }

    // Always ensure we have a default "--Select--" option at the beginning
    if (
      !transformedData.types.some(
        (type: any) =>
          type.value === "0" || type.value === "" || type.value === null,
      )
    ) {
      transformedData.types.unshift({ value: "0", label: "--Select--" });
    }

    res.json(transformedData);
  } catch (error) {
    console.error("❌ Error proxying to external FormDesign API:", error);

    let errorMessage =
      "Failed to fetch document design types from external API";
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "External FormDesign API is not accessible. Please ensure the API server at https://localhost:7129 is running.";
      } else if (error.message.includes("fetch failed")) {
        errorMessage = "Network error connecting to external FormDesign API.";
      }
    }

    // Return error info with fallback data
    res.json({
      error: errorMessage,
      types: [
        { value: "0", label: "--Select--" },
        { value: "error", label: "⚠️ API Connection Failed" },
      ],
    });
  }
};
