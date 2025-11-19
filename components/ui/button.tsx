import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-title-small font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      variant: {
        default: 'bg-[#FFB84D] text-black hover:bg-[#FFB84D]/90 shadow-sm rounded-[10px] h-12 px-6',
        outline: 'border border-black bg-transparent text-black hover:bg-black/5 rounded-[10px] h-12 px-6',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 rounded-[10px] h-12 px-6',
        secondary: 'bg-[#FFB84D] text-black hover:bg-[#FFB84D]/80 rounded-[10px] h-12 px-6',
        ghost: 'hover:bg-accent/10 hover:text-black text-black rounded-[10px]',
        link: 'text-black underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4 text-body-medium',
        lg: 'h-14 px-8 text-title-medium',
        icon: 'size-12',
        'icon-sm': 'size-10',
        'icon-lg': 'size-14',
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
