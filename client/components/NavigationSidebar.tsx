import React, { useState } from 'react';
import { Menu, X, BarChart3, Layers, FileText, Settings, Assessment } from 'lucide-react';

interface NavigationSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ 
  isOpen = false, 
  onToggle 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onToggle?.();
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      href: 'https://b1medicare-dev.simplifyhealthcloud.com/Overview/Index',
      isActive: false
    },
    {
      id: 'design',
      label: 'Design', 
      icon: Layers,
      href: 'https://b1medicare-dev.simplifyhealthcloud.com/FormDesign/Index',
      isActive: true
    },
    {
      id: 'rules-manager',
      label: 'Rules Manager',
      icon: FileText, 
      href: 'https://b1medicare-dev.simplifyhealthcloud.com/RulesManager/Index',
      isActive: false
    },
    {
      id: 'extended-hangfire',
      label: 'Extended Hangfire',
      icon: Assessment,
      href: 'https://b1medicare-dev.simplifyhealthcloud.com/ExtendedHangfire/Index', 
      isActive: false
    },
    {
      id: 'configuration',
      label: 'Configuration',
      icon: Settings,
      href: 'https://b1medicare-dev.simplifyhealthcloud.com/AppSettings/AppSettings',
      isActive: false
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <nav
        role="navigation"
        className={`fixed top-[52px] left-0 h-[calc(100vh-52px)] bg-[rgb(0,61,93)] text-center z-[1005] transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16 lg:w-16 -translate-x-full lg:translate-x-0'
        } ${isSidebarOpen ? 'translate-x-0' : ''}`}
      >
        <ul className="h-full overflow-y-auto overflow-x-hidden pb-12 text-center w-full">
          {/* Menu Toggle Button */}
          <li className="border-b border-[rgb(153,177,190)] border-solid h-10 justify-center mb-0.5 mt-0 px-3 pt-2.5 relative text-center cursor-pointer">
            <button
              onClick={toggleSidebar}
              className="relative inline-block h-5 w-5 text-center align-middle cursor-pointer text-white"
            >
              {isSidebarOpen ? (
                <X size={20} className="text-white" />
              ) : (
                <div className="flex flex-col space-y-1">
                  <span className="block w-5 h-0.5 bg-white rounded"></span>
                  <span className="block w-5 h-0.5 bg-white rounded"></span>
                  <span className="block w-5 h-0.5 bg-white rounded"></span>
                </div>
              )}
            </button>
            {isSidebarOpen && (
              <span className="text-white text-base leading-6 ml-1.5 inline">
                Close Menu
              </span>
            )}
          </li>

          {/* Navigation Items */}
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li 
                key={item.id}
                className={`h-10 mb-0.5 mx-1.5 mt-2.5 px-2 pt-1.25 relative text-center ${
                  item.isActive 
                    ? 'bg-[rgb(1,116,178)] rounded-lg' 
                    : ''
                }`}
              >
                <a
                  href={item.href}
                  className={`flex items-center rounded-lg border-none border-solid h-7.5 text-base leading-6 overflow-hidden px-0.25 py-1.75 text-center no-underline whitespace-nowrap ${
                    item.isActive
                      ? 'text-white relative z-[1200]'
                      : 'text-[rgb(153,177,190)] hover:text-white'
                  } transition-colors duration-200`}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    item.isActive ? 'bg-[rgb(1,116,178)]' : ''
                  }`}>
                    <IconComponent size={22} className="text-white" />
                  </div>
                  {isSidebarOpen && (
                    <span className="text-base leading-6 px-0 py-2 text-center whitespace-nowrap ml-2">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default NavigationSidebar;
