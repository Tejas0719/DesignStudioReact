import React, { useState, useEffect } from "react";
import { ChevronDown, Loader2, X, Eye } from "lucide-react";
import DesignStudioHeader from "../components/DesignStudioHeader";
import NavigationSidebar from "../components/NavigationSidebar";
import {
  DocumentDesignResponse,
  DocumentDesignData,
  DocumentType,
  DocumentTypesResponse,
} from "@shared/api";

interface BenefitCategory {
  id: string;
  label: string;
  value: string;
}

interface DocumentDesignVersion {
  index: number;
  environmentName: string;
  tenantId: number;
  formDesignVersionId: number;
  effectiveDate: string;
  version: string;
  statusId: number;
  statusText: string;
  formDesignId: number;
}

interface DocumentDesignVersionResponse {
  data: DocumentDesignVersion[];
  error?: string;
}

const benefitCategories: BenefitCategory[] = [];

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState("documents");
  const [documentType, setDocumentType] = useState("0");
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);
  const [documentDesigns, setDocumentDesigns] = useState<DocumentDesignData[]>(
    [],
  );
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    { value: "0", label: "Loading..." },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typesError, setTypesError] = useState<string | null>(null);

  // Document Design Version states
  const [selectedDesign, setSelectedDesign] = useState<DocumentDesignData | null>(null);
  const [designVersions, setDesignVersions] = useState<DocumentDesignVersion[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [versionsError, setVersionsError] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string, value: string) => {
    setCategories((prev) => ({ ...prev, [categoryId]: value }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleActivityLog = () => {
    setIsActivityLogExpanded(!isActivityLogExpanded);
  };

  const fetchDocumentDesigns = async (type: string) => {
    if (type === "0") {
      setDocumentDesigns([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(
        `/api/form-design/designs-by-type/${type}?_t=${cacheBuster}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch document designs");
      }

      const data: DocumentDesignResponse = await response.json();

      // Handle error response from proxy
      if (data.error) {
        setError(data.error);
        setDocumentDesigns([]);
      } else {
        setDocumentDesigns(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setDocumentDesigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocumentDesignVersions = async (design: DocumentDesignData) => {
    const formDesignId = (design as any).FormDesignId ?? 
                        design.id ?? 
                        (design as any).formDesignId ?? 
                        (design as any).designId;

    if (!formDesignId) {
      setVersionsError("No form design ID found for this design");
      return;
    }

    setIsLoadingVersions(true);
    setVersionsError(null);
    setSelectedDesign(design);

    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(
        `/api/form-design/design-versions/${formDesignId}?_t=${cacheBuster}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch document design versions");
      }

      const data: DocumentDesignVersionResponse = await response.json();

      if (data.error) {
        setVersionsError(data.error);
        setDesignVersions([]);
      } else {
        setDesignVersions(data.data);
      }
    } catch (err) {
      setVersionsError(err instanceof Error ? err.message : "An error occurred");
      setDesignVersions([]);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const handleDocumentTypeChange = (newType: string) => {
    setDocumentType(newType);
    setSelectedDesign(null);
    setDesignVersions([]);
    fetchDocumentDesigns(newType);
  };

  const handleDesignRowClick = (design: DocumentDesignData) => {
    fetchDocumentDesignVersions(design);
  };

  const handleCloseVersions = () => {
    setSelectedDesign(null);
    setDesignVersions([]);
    setVersionsError(null);
  };

  const fetchDocumentTypes = async () => {
    setIsLoadingTypes(true);
    setTypesError(null);

    try {
      const cacheBuster = new Date().getTime();
      const response = await fetch(
        `/api/form-design/document-types?_t=${cacheBuster}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch document types");
      }

      const data = await response.json();

      // Handle different response formats from external API
      if (data.types && Array.isArray(data.types)) {
        setDocumentTypes(data.types);
      } else if (Array.isArray(data)) {
        // If the API returns an array directly
        const transformedTypes = data.map((item: any) => ({
          value: item.id || item.value || item.typeId || String(item),
          label: item.name || item.label || item.typeName || String(item),
          description: item.description || item.desc,
        }));
        setDocumentTypes([
          { value: "0", label: "--Select--" },
          ...transformedTypes,
        ]);
      } else {
        throw new Error("Invalid response format from external API");
      }

      // Handle error response from proxy
      if (data.error) {
        setTypesError(data.error);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load document types";
      setTypesError(errorMessage);
      // Fallback to a basic structure if API fails
      setDocumentTypes([{ value: "0", label: "--Select--" }]);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const tabs = [
    { id: "documents", label: "Documents", active: true },
    { id: "folder", label: "Folder", active: false },
    { id: "design-compile", label: "Design Compile", active: false },
    { id: "design-sync", label: "Design Sync", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Design Studio Header */}
      <DesignStudioHeader
        userName="Chetan More"
        userRole="Simplify SuperUser"
        tenant="eMS_STD"
        onMobileMenuToggle={handleSidebarToggle}
      />

      {/* Navigation Sidebar */}
      <NavigationSidebar
        isOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Main Content - Add top margin for header and left margin for sidebar */}
      <div
        className={`pt-[52px] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64 ml-0" : "lg:ml-16 ml-0"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm border border-dms-border overflow-hidden">
            {/* Navigation Tabs */}
            <div className="border-b border-dms-border bg-white">
              <nav
                className="flex flex-wrap sm:space-x-8 px-2 sm:px-4 lg:px-6"
                aria-label="Tabs"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? "dms-tab-active"
                        : "dms-tab-inactive"
                    } flex-1 sm:flex-none text-center sm:text-left min-w-0 text-xs sm:text-sm`}
                  >
                    <span className="truncate">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === "documents" && (
                <>
                  {/* Document Design Tab */}
                  <div className="bg-white border border-dms-border rounded-lg p-4 sm:p-6 mb-6">
                    <div className="border-b border-dms-border pb-4 mb-6">
                      <h3 className="text-lg font-semibold text-dms-primary bg-white px-4 py-2 border border-dms-border rounded-t-lg">
                        Document Designs
                      </h3>
                    </div>

                    {/* Document Design Type Selection */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                      <label className="text-sm font-medium text-gray-700 sm:min-w-[160px]">
                        Document Design Type:
                      </label>
                      <div className="relative flex-1 sm:min-w-[250px] sm:flex-none">
                        <select
                          value={documentType}
                          onChange={(e) =>
                            handleDocumentTypeChange(e.target.value)
                          }
                          className="dms-select pr-8 w-full"
                          disabled={isLoadingTypes}
                        >
                          {isLoadingTypes ? (
                            <option value="0">Loading types...</option>
                          ) : (
                            documentTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))
                          )}
                        </select>
                        {isLoadingTypes ? (
                          <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                        ) : (
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        )}
                      </div>
                      {typesError && (
                        <div className="text-red-500 text-sm mt-2">
                          Error loading types: {typesError}
                        </div>
                      )}
                      <button className="dms-button-primary opacity-0 pointer-events-none hidden sm:block">
                        Add
                      </button>
                    </div>

                    {/* Document Designs Data */}
                    <div className="bg-white border border-dms-border rounded-lg p-6">
                      {isLoading && (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-dms-primary mr-2" />
                          <span className="text-gray-600">
                            Loading document designs...
                          </span>
                        </div>
                      )}

                      {error && (
                        <div className="text-center py-8">
                          <p className="text-red-500 text-sm">{error}</p>
                        </div>
                      )}

                      {!isLoading &&
                        !error &&
                        documentDesigns.length === 0 &&
                        documentType !== "0" && (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">
                              No document designs found for this type
                            </p>
                          </div>
                        )}

                      {!isLoading && !error && documentDesigns.length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-dms-primary">
                              Document Design List ({documentDesigns.length})
                            </h4>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors">
                                🔄 Reload
                              </button>
                              <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                                ➕ Add
                              </button>
                              <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors">
                                ✏️ Edit
                              </button>
                              <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
                                🗑️ Delete
                              </button>
                            </div>
                          </div>

                          {/* Document Designs Table */}
                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 border-b border-gray-200">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                        Form Design ID
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                        Document Design
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                        MDM
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                        MDM Schema
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                        Status
                                      </th>
                                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created Date
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {documentDesigns.map((design, index) => (
                                      <tr
                                        key={design.id}
                                        onClick={() => handleDesignRowClick(design)}
                                        className={`${
                                          index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                        } hover:bg-blue-50 cursor-pointer transition-colors ${
                                          selectedDesign?.id === design.id
                                            ? "bg-blue-100"
                                            : ""
                                        }`}
                                      >
                                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                          {(design as any).formDesignId ||
                                            design.id}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium">
                                          {(design as any).displayText ||
                                            design.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                          {(design as any).isMDM
                                            ? "true"
                                            : "false"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                          {(design as any).mdmSchemaName || ""}
                                        </td>
                                        <td className="px-4 py-3 text-sm border-r border-gray-200">
                                          <span
                                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                                              design.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : design.status === "Draft"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-gray-100 text-gray-800"
                                            }`}
                                          >
                                            {design.status}
                                          </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                          {design.createdDate}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {documentType === "0" && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 text-sm">
                            Please select a document design type to view
                            available designs
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Design Version List */}
                  {selectedDesign && (
                    <div className="bg-white border border-dms-border rounded-lg p-4 sm:p-6 mb-6">
                      <div className="border-b border-dms-border pb-4 mb-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-dms-primary bg-white px-4 py-2 border border-dms-border rounded-t-lg">
                            Document Design Version List - {selectedDesign.name || (selectedDesign as any).displayText}
                          </h3>
                          <button
                            onClick={handleCloseVersions}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Close versions"
                          >
                            <X className="h-5 w-5 text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-dms-border rounded-lg p-6">
                        {isLoadingVersions && (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-dms-primary mr-2" />
                            <span className="text-gray-600">
                              Loading design versions...
                            </span>
                          </div>
                        )}

                        {versionsError && (
                          <div className="text-center py-8">
                            <p className="text-red-500 text-sm">{versionsError}</p>
                          </div>
                        )}

                        {!isLoadingVersions && !versionsError && designVersions.length === 0 && (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-sm">
                              No versions found for this design
                            </p>
                          </div>
                        )}

                        {!isLoadingVersions && !versionsError && designVersions.length > 0 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-semibold text-dms-primary">
                                Version List ({designVersions.length})
                              </h4>
                              <div className="flex gap-2">
                                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors">
                                  🔄 Reload Grid
                                </button>
                                <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                                  ➕ Add
                                </button>
                                <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors">
                                  ✏️ Edit
                                </button>
                                <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
                                  🗑️ Delete
                                </button>
                                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors">
                                  ✅ Finalized
                                </button>
                              </div>
                            </div>

                            {/* Document Design Versions Table */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 border-b border-gray-200">
                                <div className="overflow-x-auto">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          Index
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          Environment Name
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          TenantId
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          FormDesignVersionId
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          Effective Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          Version
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          StatusId
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                                          Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                          Action
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {designVersions.map((version, index) => (
                                        <tr
                                          key={`${version.formDesignVersionId}-${version.environmentName}`}
                                          className={`${
                                            index % 2 === 0
                                              ? "bg-white"
                                              : "bg-gray-50"
                                          } hover:bg-blue-50 transition-colors`}
                                        >
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.index}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200 font-medium">
                                            {version.environmentName}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.tenantId}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.formDesignVersionId}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.effectiveDate}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.version}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                                            {version.statusId}
                                          </td>
                                          <td className="px-4 py-3 text-sm border-r border-gray-200">
                                            <span
                                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                version.statusText === "Finalized" || version.statusText === "Active"
                                                  ? "bg-green-100 text-green-800"
                                                  : version.statusText === "Draft"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-800"
                                              }`}
                                            >
                                              {version.statusText}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900">
                                            <button
                                              className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                                              title="View Design"
                                            >
                                              <Eye className="h-4 w-4" />
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Placeholder content for other tabs */}
              {activeTab !== "documents" && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {tabs.find((tab) => tab.id === activeTab)?.label} Section
                    </h3>
                    <p className="text-gray-500 mb-4">
                      This section is under development. Please continue
                      prompting to add content for this tab.
                    </p>
                    <button className="dms-button-secondary">
                      Request Implementation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity Log Section */}
          <div className="mt-6 bg-white border border-dms-border rounded-lg overflow-hidden">
            <div className="bg-dms-primary text-white px-4 sm:px-6 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-semibold">
                  Activity Log
                </h3>
                <button
                  onClick={toggleActivityLog}
                  className="p-1 rounded hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                  aria-label={
                    isActivityLogExpanded
                      ? "Collapse Activity Log"
                      : "Expand Activity Log"
                  }
                >
                  <ChevronDown
                    size={20}
                    className={`text-white transition-transform duration-200 ${
                      isActivityLogExpanded ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isActivityLogExpanded
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="p-4 sm:p-6 text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base">
                  No recent activity to display
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`bg-dms-primary text-white py-4 mt-12 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-64 ml-0" : "lg:ml-16 ml-0"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © Copyright 2025 Simplify Healthcare Technology, All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
