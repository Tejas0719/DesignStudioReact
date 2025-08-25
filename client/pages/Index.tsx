import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import DesignStudioHeader from '../components/DesignStudioHeader';
import NavigationSidebar from '../components/NavigationSidebar';

interface BenefitCategory {
  id: string;
  label: string;
  value: string;
}

const benefitCategories: BenefitCategory[] = [
  { id: 'category1', label: 'Benefit Category1', value: '' },
  { id: 'category2', label: 'Benefit Category2', value: '' },
  { id: 'category3', label: 'Benefit Category3', value: '' },
  { id: 'seseid', label: 'SESEID', value: '' },
];

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
  const [collateralName, setCollateralName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategoryChange = (categoryId: string, value: string) => {
    setCategories(prev => ({ ...prev, [categoryId]: value }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        {/* Document Management System Subheader */}
        <div className="bg-white shadow-sm border-b border-dms-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-dms-primary">Document Management System</h1>
              </div>
            </div>
          </div>
        </div>

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
                        onChange={(e) => setDocumentType(e.target.value)}
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

                  {/* Benefit Categories - Responsive Layout */}
                  <div className="bg-white border border-dms-border rounded-lg overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <table className="w-full">
                        <tbody className="divide-y divide-dms-border">
                          {Array.from({ length: Math.ceil(benefitCategories.length / 2) }, (_, index) => {
                            const leftCategory = benefitCategories[index * 2];
                            const rightCategory = benefitCategories[index * 2 + 1];
                            return (
                              <tr key={leftCategory.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 w-1/4">
                                  <label>
                                    <span>{leftCategory.label}</span>
                                  </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                  <div className="relative">
                                    <select
                                      value={categories[leftCategory.id] || '0'}
                                      onChange={(e) => handleCategoryChange(leftCategory.id, e.target.value)}
                                      className="dms-select w-full pr-8"
                                    >
                                      <option value="0">Select One</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                  </div>
                                </td>
                                {rightCategory && (
                                  <>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 w-1/4">
                                      <label>
                                        <span>{rightCategory.label}</span>
                                      </label>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap w-1/4">
                                      <div className="relative">
                                        <select
                                          value={categories[rightCategory.id] || '0'}
                                          onChange={(e) => handleCategoryChange(rightCategory.id, e.target.value)}
                                          className="dms-select w-full pr-8"
                                        >
                                          <option value="0">Select One</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                      </div>
                                    </td>
                                  </>
                                )}
                                {!rightCategory && (
                                  <>
                                    <td className="px-6 py-4 w-1/4"></td>
                                    <td className="px-6 py-4 w-1/4"></td>
                                  </>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-dms-border">
                      {benefitCategories.map((category) => (
                        <div key={category.id} className="p-4">
                          <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              {category.label}
                            </label>
                            <div className="relative">
                              <select
                                value={categories[category.id] || '0'}
                                onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                                className="dms-select w-full pr-8"
                              >
                                <option value="0">Select One</option>
                              </select>
                              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Collateral Section */}
                <div className="bg-white border border-dms-border rounded-lg p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <label className="text-sm font-medium text-gray-700 sm:min-w-[140px]">
                      Collateral Name
                    </label>
                    <div className="relative flex-1 sm:max-w-sm">
                      <select
                        value={collateralName}
                        onChange={(e) => setCollateralName(e.target.value)}
                        className="dms-select w-full pr-8"
                      >
                        <option value="">Select Collateral</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <button className="dms-button-primary w-full sm:w-auto">
                        View Report
                      </button>
                      <button className="dms-button-primary w-full sm:w-auto">
                        Generate Report
                      </button>
                    </div>
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
        <div className="mt-6 bg-white border border-dms-border rounded-lg p-4 sm:p-6">
          <div className="bg-dms-primary text-white rounded-t-lg px-4 sm:px-6 py-3 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold">Activity Log</h3>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-white/20 transition-colors">
                  <span className="sr-only">Options</span>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-gray-500">
            <p className="text-sm sm:text-base">No recent activity to display</p>
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
