"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RFQForm } from './rfq-form'
import { useToast } from '@/hooks/use-toast'

interface Product {
  id: string
  name: string
  unit: string
  supplier: {
    name: string
    id?: string
  }
  origin?: string
}

interface RequestQuoteModalProps {
  product: Product
  children: React.ReactNode
}

export function RequestQuoteModal({ product, children }: RequestQuoteModalProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setTimeout(() => {
      setOpen(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Request a Quote</DialogTitle>
          <DialogDescription>
            Send a quote request for <span className="font-medium text-foreground">{product.name}</span> to {product.supplier.name}
            {product.origin && <span className="text-xs block mt-1">Origin: {product.origin}</span>}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <RFQForm 
            product={product} 
            onSuccess={handleSuccess}
            onCancel={() => setOpen(false)}
            showCancelButton
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
