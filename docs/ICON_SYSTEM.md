# FoodXtrade Icon System

A comprehensive guide to using icons consistently across the platform.

## Icon Library

We use **Lucide React** exclusively for all icons across the application.

- **Package**: `lucide-react`
- **Style**: Outline icons with 1.5px stroke width
- **Aesthetic**: Minimal, professional, rounded corners

## Icon Sizes

### Desktop
- **Navigation icons**: 20-24px (`h-5 w-5` to `h-6 w-6`)
- **Inline icons** (buttons, badges): 18-20px (`h-[18px] w-[18px]` to `h-5 w-5`)
- **Large icons** (headers): 24px (`h-6 w-6`)
- **Extra large** (hero sections): 32px (`h-8 w-8`)

### Tablet
- **Navigation icons**: 20px (`h-5 w-5`)
- **Inline icons**: 18px (`h-[18px] w-[18px]`)
- **Large icons**: 22px
- **Extra large**: 28px

### Mobile
- **Navigation icons**: 20px (`h-5 w-5`)
- **Inline icons**: 16px (`h-4 w-4`)
- **Large icons**: 20px (`h-5 w-5`)
- **Extra large**: 24px (`h-6 w-6`)

## Standard Icon Classes

Import the icon system utilities:

\`\`\`typescript
import { ICON_CLASSES, ICON_SPACING } from '@/lib/icon-system'
\`\`\`

### Available Classes

\`\`\`typescript
ICON_CLASSES.navigation  // For sidebar/header navigation (20-24px)
ICON_CLASSES.inline      // For buttons and inline use (16-18px)
ICON_CLASSES.large       // For headers and features (20-24px)
ICON_CLASSES.xlarge      // For hero sections (24-32px)
ICON_CLASSES.menu        // For hamburger menu (20-24px)
ICON_CLASSES.status      // For badges and status (16px)
ICON_CLASSES.spinner     // For loading indicators (16-20px)
\`\`\`

### Spacing

\`\`\`typescript
ICON_SPACING.tight    // 4px gap
ICON_SPACING.normal   // 6px gap (recommended)
ICON_SPACING.relaxed  // 8px gap
\`\`\`

## Usage Examples

### Navigation Icons

\`\`\`tsx
import { Package } from 'lucide-react'
import { ICON_CLASSES } from '@/lib/icon-system'

<Link href="/products" className="flex items-center gap-2">
  <Package className={ICON_CLASSES.navigation} strokeWidth={1.5} />
  Products
</Link>
\`\`\`

### Button Icons

\`\`\`tsx
import { ArrowRight } from 'lucide-react'
import { ICON_CLASSES, ICON_SPACING } from '@/lib/icon-system'

<Button className={ICON_SPACING.normal}>
  Learn More
  <ArrowRight className={ICON_CLASSES.inline} strokeWidth={1.5} />
</Button>
\`\`\`

### Badge Icons

\`\`\`tsx
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

<Badge variant="verified">
  <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
  Verified
</Badge>
\`\`\`

### Status Icons (Minimal)

\`\`\`tsx
import { Shield } from 'lucide-react'
import { ICON_CLASSES } from '@/lib/icon-system'

<div className="flex items-center gap-1">
  <Shield className={ICON_CLASSES.status} strokeWidth={1.5} />
  <span className="text-xs">Low Risk</span>
</div>
\`\`\`

## Color Guidelines

Icons follow the enterprise color system:

- **Primary**: BlueBlack (`#0D1117`) for main navigation and actions
- **Secondary**: SlateGrey (`#586069`) for inactive states
- **Accent**: Use sparingly with customs badges (LittleBlue `#3DA9FC`)
- **Status**: 
  - Verified: CheckCircle2 with SoftBlueGrey background
  - Risk: Shield icon with appropriate variant
  - Customs: Truck/Globe with LittleBlue

## Mobile Menu

The mobile menu icon appears on screens < 1024px:

\`\`\`tsx
import { Menu } from 'lucide-react'
import { ICON_CLASSES } from '@/lib/icon-system'

<Button 
  variant="ghost" 
  size="icon" 
  className="h-11 w-11 min-h-[44px] min-w-[44px]"
>
  <Menu className={ICON_CLASSES.menu} strokeWidth={1.5} />
</Button>
\`\`\`

## Best Practices

1. **Always specify strokeWidth={1.5}** for consistency
2. **Use standardized classes** from `ICON_CLASSES` instead of arbitrary sizes
3. **Maintain 44px minimum touch targets** on mobile for accessibility
4. **Use icons sparingly** - enhance, don't clutter
5. **Keep colors minimal** - stay within the BlueBlack/grey palette
6. **Test responsiveness** - ensure icons scale properly across breakpoints

## Icon Inventory

Common icons used across the platform:

- **Navigation**: LayoutDashboard, Package, ShoppingCart, MessageSquare, BarChart3, Settings
- **Actions**: ArrowRight, ArrowLeft, Plus, Edit, Trash2, Upload, Send
- **Status**: CheckCircle2, Shield, Lock, AlertCircle, Clock
- **Data**: TrendingUp, TrendingDown, Eye, Users, Building2
- **UI Controls**: Menu, X, ChevronDown, ChevronRight, Search
- **Loading**: Loader2 (with animate-spin)
