import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AlertOctagon, ArrowLeft, Home } from 'lucide-react';
import { RootState } from '../store';

const NotFound: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return '/login';
    return `/dashboard/${user.role.toLowerCase()}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-4 py-12">
      <div className="text-center">
        <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <AlertOctagon className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-10 flex justify-center space-x-4">
          <Link
            to={getDashboardLink()}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;