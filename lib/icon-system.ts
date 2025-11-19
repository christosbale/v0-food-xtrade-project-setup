/**
 * FoodXtrade Icon System Configuration
 * 
 * Standardizes icon usage across desktop, tablet, and mobile
 * Following clay.global aesthetic with outline style, 1.5px stroke, rounded corners
 */

// Standard icon sizes (in pixels)
export const ICON_SIZES = {
  // Desktop sizes
  desktop: {
    navigation: 20,      // Primary nav icons
    inline: 18,          // Buttons, badges
    large: 24,           // Hero sections, headers
    xlarge: 32,          // Large feature sections
  },
  // Tablet sizes
  tablet: {
    navigation: 20,
    inline: 18,
    large: 22,
    xlarge: 28,
  },
  // Mobile sizes
  mobile: {
    navigation: 20,      // Touch-friendly nav
    inline: 16,          // Compact inline icons
    large: 20,
    xlarge: 24,
  },
} as const

// Standard icon classes for responsive sizing
export const ICON_CLASSES = {
  // Navigation icons (20-24px desktop, 20px mobile)
  navigation: 'h-5 w-5 lg:h-6 lg:w-6',
  
  // Inline icons for buttons/badges (16-18px)
  inline: 'h-4 w-4 md:h-[18px] md:w-[18px]',
  
  // Large icons for headers/features (20-24px)
  large: 'h-5 w-5 md:h-6 md:w-6',
  
  // Extra large for hero sections (24-32px)
  xlarge: 'h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8',
  
  menu: 'h-9 w-9 md:h-11 md:w-11',
  
  // Status icons (verified, customs, etc.) - 16-18px
  status: 'h-4 w-4',
  
  // Loading spinner (16-20px)
  spinner: 'h-4 w-4 md:h-5 md:w-5',
} as const

// Icon spacing guidelines (gap between icon and text)
export const ICON_SPACING = {
  tight: 'gap-1',      // 4px - for compact buttons
  normal: 'gap-1.5',   // 6px - standard spacing
  relaxed: 'gap-2',    // 8px - for larger elements
} as const

// Lucide icon configuration (applied globally)
export const LUCIDE_CONFIG = {
  strokeWidth: 1.5,    // Minimal, professional stroke
  absoluteStrokeWidth: false,
} as const

export const MENU_ICON_CONFIG = {
  strokeWidth: 3,    // Extra bold, commanding stroke for menu icons
  absoluteStrokeWidth: false,
} as const

// Helper function to get responsive icon size class
export function getIconClass(type: keyof typeof ICON_CLASSES): string {
  return ICON_CLASSES[type]
}
