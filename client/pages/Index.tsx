import React, { useState } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import DesignStudioHeader from '../components/DesignStudioHeader';
import NavigationSidebar from '../components/NavigationSidebar';
import { DocumentDesignResponse, DocumentDesignData } from '@shared/api';

interface BenefitCategory {
  id: string;
  label: string;
  value: string;
}

const benefitCategories: BenefitCategory[] = [];

const documentTypes = [
  { value: '0', label: '--Select--' },
  { value: '1', label: 'Anchor' },
  { value: '2', label: 'MasterList' },
  { value: '11', label: 'Collateral' },
  { value: '14', label: 'View' },
];

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [documentType, setDocumentType] = useState('0');
  const [categories, setCategories] = useState<Record<string, string>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);
  const [documentDesigns, setDocumentDesigns] = useState<DocumentDesignData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryChange = (categoryId: string, value: string) => {
    setCategories(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleActivityLog = () => {
    setIsActivityLogExpanded(!isActivityLogExpanded);
  };

  const fetchDocumentDesigns = async (type: string) => {
    if (type === '0') {
      setDocumentDesigns([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/document-designs/${type}`);
      if (!response.ok) {
        throw new Error('Failed to fetch document designs');
      }

      const data: DocumentDesignResponse = await response.json();
      setDocumentDesigns(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setDocumentDesigns([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDocumentTypeChange = (newType: string) => {
    setDocumentType(newType);
    fetchDocumentDesigns(newType);
  };

  const tabs = [
    { id: 'documents', label: 'Documents', active: true },
    { id: 'folder', label: 'Folder', active: false },
    { id: 'design-compile', label: 'Design Compile', active: false },
    { id: 'design-sync', label: 'Design Sync', active: false },
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
      <div className={`pt-[52px] transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-64 ml-0' : 'lg:ml-16 ml-0'
      }`}>

        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-dms-border overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-dms-border bg-white">
            <nav className="flex flex-wrap sm:space-x-8 px-2 sm:px-4 lg:px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'dms-tab-active'
                      : 'dms-tab-inactive'
                  } flex-1 sm:flex-none text-center sm:text-left min-w-0 text-xs sm:text-sm`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'documents' && (
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
                        onChange={(e) => handleDocumentTypeChange(e.target.value)}
                        className="dms-select pr-8 w-full"
                      >
                        {documentTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <button className="dms-button-primary opacity-0 pointer-events-none hidden sm:block">
                      Add
                    </button>
                  </div>

                  {/* Benefit categories section - kept blank */}
                  <div className="bg-white border border-dms-border rounded-lg p-6">
                  </div>
                </div>

              </>
            )}

            {/* Placeholder content for other tabs */}
            {activeTab !== 'documents' && (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.label} Section
                  </h3>
                  <p className="text-gray-500 mb-4">
                    This section is under development. Please continue prompting to add content for this tab.
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
              <h3 className="text-base sm:text-lg font-semibold">Activity Log</h3>
              <button
                onClick={toggleActivityLog}
                className="p-1 rounded hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
                aria-label={isActivityLogExpanded ? 'Collapse Activity Log' : 'Expand Activity Log'}
              >
                <ChevronDown
                  size={20}
                  className={`text-white transition-transform duration-200 ${
                    isActivityLogExpanded ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isActivityLogExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-4 sm:p-6 text-center py-8 text-gray-500">
              <p className="text-sm sm:text-base">No recent activity to display</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Footer */}
      <footer className={`bg-dms-primary text-white py-4 mt-12 transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'lg:ml-64 ml-0' : 'lg:ml-16 ml-0'
      }`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © Copyright 2025 Simplify Healthcare Technology, All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
