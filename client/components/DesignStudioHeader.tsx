import React, { useState } from 'react';
import { User, ChevronDown, Menu } from 'lucide-react';

interface DesignStudioHeaderProps {
  userName?: string;
  userRole?: string;
  tenant?: string;
  onMobileMenuToggle?: () => void;
}

const DesignStudioHeader: React.FC<DesignStudioHeaderProps> = ({
  userName = "Chetan More",
  userRole = "Simplify SuperUser",
  tenant = "eMS_STD",
  onMobileMenuToggle
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[52px] bg-white shadow-md border-b-2 border-gray-200 flex items-center justify-between px-6 z-[1006] transition-all duration-200 ease-in-out">
      {/* Left Section */}
      <div className="flex items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden mr-4 p-2 rounded-md text-[rgb(0,61,93)] hover:bg-gray-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>

        <a
          href="https://b1medicare-dev.simplifyhealthcloud.com/Overview/Index"
          className="text-lg font-semibold text-[rgb(0,61,93)] border-b-[0.888889px] border-[rgb(0,61,93)] lg:ml-16 ml-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Design Studio
        </a>
        <div className="ml-2.5 pl-2.5 border-l-[0.888889px] border-[rgb(230,230,230)] text-base font-semibold text-[rgb(51,51,51)] capitalize">
          Design
        </div>
      </div>

      {/* Right Section - User Menu */}
      <div className="flex items-center relative">
        <div className="pt-1">
          <button
            onClick={toggleUserMenu}
            className="cursor-pointer inline-flex items-center font-bold focus:outline-none hover:opacity-80 transition-opacity"
            aria-expanded={isUserMenuOpen}
            aria-controls="userMenu"
          >
            <div className="flex items-center">
              {/* User Icon */}
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                <User size={16} className="text-white" />
              </div>
              <ChevronDown size={16} className="text-gray-600" />
            </div>
          </button>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsUserMenuOpen(false)}
              />
              
              {/* Menu */}
              <ul className="absolute right-1 top-12 w-[250px] bg-white border border-[rgb(36,55,84)] rounded-lg shadow-lg z-[9999] py-4 px-5">
                <li className="py-0.5 text-left">
                  <div className="text-[rgb(172,172,172)] font-medium">
                    <span>User Name : </span>
                    <span className="text-black font-medium ml-1">
                      {userName}
                    </span>
                  </div>
                </li>
                <li className="py-0.5 text-left">
                  <div className="text-[rgb(172,172,172)] font-medium">
                    <span>User Role :</span>
                    <span className="text-black font-medium ml-1">
                      {userRole}
                    </span>
                  </div>
                </li>
                <li className="py-0.5 text-left">
                  <div className="text-[rgb(172,172,172)] font-medium">
                    <span>Tenant :</span>
                    <span className="text-black font-medium ml-1">
                      {tenant}
                    </span>
                  </div>
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesignStudioHeader;
