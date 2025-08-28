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

export const handleFormDesignListByDocTypeProxy: RequestHandler = async (
  req,
  res,
) => {
  try {
    const { docTypeId } = req.params;

    if (!docTypeId || docTypeId === "0") {
      return res.json({
        data: [],
        message: "No document type selected",
      });
    }

    console.log(
      `🔄 Proxying request to external FormDesignListByDocType API for docTypeId: ${docTypeId}...`,
    );

    const externalUrl = `${EXTERNAL_API_BASE}FormDesign/FormDesignListByDocType?docTypeId=${docTypeId}`;

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
    console.log("📦 External API response for FormDesignListByDocType:", data);

    // Transform the response to match our expected format
    let transformedData;

    if (Array.isArray(data)) {
      // If it's already an array, transform the items
      transformedData = {
        data: data.map((item: any) => ({
          id: item.id || item.formDesignId || item.designId,
          name: item.name || item.displayText || item.designName || item.title,
          description:
            item.description || item.desc || item.name || item.displayText,
          status: item.status || item.isActive ? "Active" : "Inactive",
          version: item.version || "1.0",
          createdDate:
            item.createdDate || item.created || new Date().toLocaleDateString(),
          formDesignId: item.formDesignId || item.id,
          displayText: item.displayText || item.name,
          isMDM: item.isMDM || false,
          mdmSchemaName: item.mdmSchemaName || "",
          sourceDesign: item.sourceDesign || 0,
          isAliasDesignMasterList: item.isAliasDesignMasterList || false,
          usesAliasDesignMasterList: item.usesAliasDesignMasterList || false,
          isSectionLock: item.isSectionLock || false,
        })),
      };
    } else if (data.data || data.result || data.formDesigns) {
      // If it's wrapped in an object
      const items = data.data || data.result || data.formDesigns;
      transformedData = {
        data: items.map((item: any) => ({
          id: item.id || item.formDesignId || item.designId,
          name: item.name || item.displayText || item.designName || item.title,
          description:
            item.description || item.desc || item.name || item.displayText,
          status: item.status || item.isActive ? "Active" : "Inactive",
          version: item.version || "1.0",
          createdDate:
            item.createdDate || item.created || new Date().toLocaleDateString(),
          formDesignId: item.formDesignId || item.id,
          displayText: item.displayText || item.name,
          isMDM: item.isMDM || false,
          mdmSchemaName: item.mdmSchemaName || "",
          sourceDesign: item.sourceDesign || 0,
          isAliasDesignMasterList: item.isAliasDesignMasterList || false,
          usesAliasDesignMasterList: item.usesAliasDesignMasterList || false,
          isSectionLock: item.isSectionLock || false,
        })),
      };
    } else {
      // If format is unknown, use as is
      transformedData = { data: data };
    }

    res.json(transformedData);
  } catch (error) {
    console.error(
      "❌ Error proxying to external FormDesignListByDocType API:",
      error,
    );

    let errorMessage = "Failed to fetch document designs from external API";
    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "External FormDesign API is not accessible. Please ensure the API server at https://localhost:7129 is running.";
      } else if (error.message.includes("fetch failed")) {
        errorMessage = "Network error connecting to external FormDesign API.";
      }
    }

    // Return error info with empty data
    res.json({
      error: errorMessage,
      data: [],
    });
  }
};
