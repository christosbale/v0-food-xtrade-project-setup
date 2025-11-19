import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E2E2]">
      <div className="container-boxed flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-xl font-bold tracking-tight text-[#0D1117]">
            food<span className="text-[#FFD036]">X</span>trade
          </span>
        </Link>
        
        <nav className="hidden items-center gap-7 lg:flex">
          <Link
            href="/products"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            Products
          </Link>
          <Link
            href="/price-index"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            Price Index
          </Link>
          <Link
            href="/insights"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            Insights
          </Link>
          <Link
            href="/logistics"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            Logistics
          </Link>
          <Link
            href="/buyers"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            For Buyers
          </Link>
          <Link
            href="/suppliers"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            For Suppliers
          </Link>
          <Link
            href="/pricing"
            className="text-[14px] font-medium text-[#0D1117] tracking-[-0.2px] leading-none transition-colors hover:text-[#0D1117]/70 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-[#0D1117] after:transition-all hover:after:w-full"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-[14px] font-medium text-[#0D1117] hover:bg-[#F6F6F6] h-auto py-2 px-4"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#0D1117] text-white font-medium hover:bg-[#0D1117]/90 text-[14px] h-auto py-2 px-[18px] rounded-md">
                Get Started
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4 text-[#0D1117]" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white border-[#E2E2E2]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/products"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  Products
                </Link>
                <Link
                  href="/price-index"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  Price Index
                </Link>
                <Link
                  href="/insights"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  Insights
                </Link>
                <Link
                  href="/logistics"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  Logistics
                </Link>
                <Link
                  href="/buyers"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  For Buyers
                </Link>
                <Link
                  href="/suppliers"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  For Suppliers
                </Link>
                <Link
                  href="/pricing"
                  className="text-[14px] font-medium text-[#0D1117] py-2 transition-colors hover:text-[#0D1117]/70"
                >
                  Pricing
                </Link>
                <div className="mt-4 flex flex-col gap-3 border-t border-[#E2E2E2] pt-4">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start text-[14px] text-[#0D1117] hover:bg-[#F6F6F6]">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-[#0D1117] text-white font-medium hover:bg-[#0D1117]/90 text-[14px]">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
