import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { ICON_CLASSES } from '@/lib/icon-system'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#0D1117] text-white [&>svg]:h-4 [&>svg]:w-4',
        secondary:
          'bg-[#FFD036] text-[#0D1117] [&>svg]:h-4 [&>svg]:w-4',
        destructive:
          'bg-destructive text-white [&>svg]:h-4 [&>svg]:w-4',
        outline:
          'border border-[#E2E2E2] text-[#0D1117] [&>svg]:h-4 [&>svg]:w-4',
        customs:
          'bg-[#3DA9FC] text-white font-bold uppercase rounded-md [&>svg]:h-4 [&>svg]:w-4',
        verified:
          'bg-[#DDE9F8] text-[#0D1117] font-bold [&>svg]:h-4 [&>svg]:w-4',
        'risk-low':
          'bg-[#DDE9F8] text-[#0D1117] font-bold [&>svg]:h-4 [&>svg]:w-4',
        'risk-medium':
          'bg-[#F6F6F6] text-[#0D1117] font-bold [&>svg]:h-4 [&>svg]:w-4',
        'risk-high':
          'bg-transparent border border-[#FFD036] text-[#0D1117] font-bold [&>svg]:h-4 [&>svg]:w-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
