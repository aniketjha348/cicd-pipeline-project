import React, { createContext, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setTheme } from '../store/slices/uiSlice';

interface ThemeContextProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<ThemeContextProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state: RootState) => state.ui);

  // Apply theme when it changes
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
    // localStorage.setItem("theme",(theme ?? "light"))
  }, [theme]);

  // Check for user preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      dispatch(setTheme(savedTheme));
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      dispatch(setTheme('dark'));
    }
  }, [dispatch]);

  return (
    <ThemeContext.Provider value={null}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;