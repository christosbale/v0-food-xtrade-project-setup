import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[6px]",
  {
    variants: {
      variant: {
        // Primary CTA: BlueBlack background, white text
        default: 'bg-[#0D1117] text-white hover:bg-[#0D1117]/90 shadow-sm',
        // Secondary: White background, BlueBlack border and text
        outline: 'border border-[#0D1117] bg-white text-[#0D1117] hover:bg-[#F6F6F6]',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        // Ghost for minimal actions
        ghost: 'hover:bg-[#F6F6F6] hover:text-[#0D1117] text-[#0D1117]',
        link: 'text-[#0D1117] underline-offset-4 hover:underline',
        // Yellow used only as minimal accent
        secondary: 'bg-[#FFD036] text-[#0D1117] hover:bg-[#FFD036]/90',
      },
      size: {
        // Padding 14px 28px per spec
        default: 'h-auto py-[14px] px-[28px] text-base',
        sm: 'h-auto py-2 px-4 text-sm',
        lg: 'h-auto py-4 px-8 text-lg',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
