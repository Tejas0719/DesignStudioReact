import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-dms-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-dms-primary">Document Management System</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-dms-gray-light flex items-center justify-center mb-4">
              <div className="text-4xl text-dms-text-muted">404</div>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or is under development.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="dms-button-primary inline-flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Dashboard
            </Link>
            
            <div className="text-sm text-gray-500">
              <p>Need help? Continue prompting to add content for this section.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dms-primary text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            © Copyright 2025 Simplify Healthcare Technology, All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
