import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogIn } from 'lucide-react';
// import { login } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { useLoginMutation } from '@/services/AuthService';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error,user,isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [login,{isLoading}]=useLoginMutation();


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(()=>{

    if(isAuthenticated && user){

      if (["admin",'faculty','student','superadmin'].includes(user?.role?.toLowerCase())) {
      navigate(`/dashboard/${user?.role.toLowerCase()}`);
    } 
    }

  },[isAuthenticated])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(login(formData.email, formData.password) as any);
    await login({data:formData,navigate}).unwrap();
    // For demo purposes, let's navigate based on email
    // if (formData.email.includes('admin')) {
    //   navigate('/dashboard/admin');
    // } else if (formData.email.includes('faculty')) {
    //   navigate('/dashboard/faculty');
    // } else if (formData.email.includes('student')) {
    //   navigate('/dashboard/student');
    // }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-8 transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 dark:text-blue-500 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2\" viewBox="0 0 24 24">
              <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4\" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <LogIn className="h-5 w-5 mr-2" />
          )}
          Sign in
        </button>

        {/* Demo accounts */}
        <div className="mt-8 space-y-4 border-t pt-6 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Demo Accounts:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ email: 'admin@example.com', password: 'password', remember: false })}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setFormData({ email: 'faculty@example.com', password: 'password', remember: false })}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => setFormData({ email: 'student@example.com', password: 'password', remember: false })}
              className="py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm rounded border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Student
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;