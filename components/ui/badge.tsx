import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-[#0D1117] text-white',
        secondary:
          'bg-[#FFD036] text-[#0D1117]',
        destructive:
          'bg-destructive text-white',
        outline:
          'border border-[#E2E2E2] text-[#0D1117]',
        customs:
          'bg-[#3DA9FC] text-white font-bold uppercase rounded-md',
        verified:
          'bg-[#DDE9F8] text-[#0D1117] font-bold',
        'risk-low':
          'bg-[#DDE9F8] text-[#0D1117] font-bold',
        'risk-medium':
          'bg-[#F6F6F6] text-[#0D1117] font-bold',
        'risk-high':
          'bg-transparent border border-[#FFD036] text-[#0D1117] font-bold',
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
