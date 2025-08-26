import { useState, useEffect } from 'react';

interface UseResponsiveProps {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

export const useResponsive = (breakpoints: UseResponsiveProps = {}) => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  const defaultBreakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    ...breakpoints,
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize.width < defaultBreakpoints.sm;
  const isTablet = screenSize.width >= defaultBreakpoints.sm && screenSize.width < defaultBreakpoints.lg;
  const isDesktop = screenSize.width >= defaultBreakpoints.lg;
  const isSmall = screenSize.width < defaultBreakpoints.md;
  const isMedium = screenSize.width >= defaultBreakpoints.md && screenSize.width < defaultBreakpoints.xl;
  const isLarge = screenSize.width >= defaultBreakpoints.xl;
  const isXL = screenSize.width >= defaultBreakpoints['2xl'];
  
  // Helper functions for different layout needs
  const getColumnsGrid = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop && screenSize.width < 1280) return 3;
    if (screenSize.width < 1536) return 4;
    return 6;
  };

  const getTableScrollable = () => screenSize.width < defaultBreakpoints.md;
  const shouldStackVertically = () => screenSize.width < defaultBreakpoints.sm;
  const shouldUseCompactLayout = () => screenSize.width < defaultBreakpoints.lg;

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    isSmall,
    isMedium,
    isLarge,
    isXL,
    breakpoints: defaultBreakpoints,
    getColumnsGrid,
    getTableScrollable,
    shouldStackVertically,
    shouldUseCompactLayout,
  };
};