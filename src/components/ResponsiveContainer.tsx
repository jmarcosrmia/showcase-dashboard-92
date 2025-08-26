import { ReactNode } from "react";
import { useResponsive } from "@/hooks/use-responsive";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveContainer = ({ children, className = "" }: ResponsiveContainerProps) => {
  return (
    <div className={`w-full max-w-full overflow-x-hidden container-responsive ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    xl?: number;
  };
}

export const ResponsiveGrid = ({ 
  children, 
  className = "", 
  cols = { mobile: 1, tablet: 2, desktop: 3, xl: 4 } 
}: ResponsiveGridProps) => {
  const { isMobile, isTablet, isDesktop, isXL } = useResponsive();
  
  let gridCols = "grid-cols-1";
  
  if (isMobile) {
    gridCols = `grid-cols-${cols.mobile || 1}`;
  } else if (isTablet) {
    gridCols = `grid-cols-${cols.tablet || 2}`;
  } else if (isDesktop && !isXL) {
    gridCols = `grid-cols-${cols.desktop || 3}`;
  } else {
    gridCols = `grid-cols-${cols.xl || 4}`;
  }

  return (
    <div className={`grid gap-2 sm:gap-3 lg:gap-4 ${gridCols} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveTableProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveTable = ({ children, className = "" }: ResponsiveTableProps) => {
  return (
    <div className={`table-responsive overflow-x-auto border rounded-lg ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveButtonGroupProps {
  children: ReactNode;
  className?: string;
}

export const ResponsiveButtonGroup = ({ children, className = "" }: ResponsiveButtonGroupProps) => {
  const { shouldStackVertically } = useResponsive();
  
  return (
    <div className={`flex gap-2 ${shouldStackVertically() ? 'flex-col' : 'flex-row'} ${className}`}>
      {children}
    </div>
  );
};