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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white backdrop-blur">
      <div className="mx-auto max-w-[1280px] flex h-18 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold tracking-tight text-black">
              food<span className="text-[#FFD500]">X</span>trade
            </span>
          </Link>
          
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/products"
              className="text-body-large font-medium text-black/70 transition-colors hover:text-black relative after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD500] after:transition-all hover:after:w-full"
            >
              Products
            </Link>
            <Link
              href="/buyers"
              className="text-body-large font-medium text-black/70 transition-colors hover:text-black relative after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD500] after:transition-all hover:after:w-full"
            >
              For Buyers
            </Link>
            <Link
              href="/suppliers"
              className="text-body-large font-medium text-black/70 transition-colors hover:text-black relative after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD500] after:transition-all hover:after:w-full"
            >
              For Suppliers
            </Link>
            <Link
              href="/how-it-works"
              className="text-body-large font-medium text-black/70 transition-colors hover:text-black relative after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD500] after:transition-all hover:after:w-full"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-body-large font-medium text-black/70 transition-colors hover:text-black relative after:absolute after:bottom-[-8px] after:left-0 after:h-[2px] after:w-0 after:bg-[#FFD500] after:transition-all hover:after:w-full"
            >
              Pricing
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-title-medium font-medium text-black hover:bg-muted"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#FFD500] text-black font-medium hover:bg-[#FFD500]/90 text-title-medium h-12 px-6 rounded-lg shadow-sm hover:shadow-md transition-all">
                Get Started
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-primary border-primary-foreground/10">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/products"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Products
                </Link>
                <Link
                  href="/buyers"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  For Buyers
                </Link>
                <Link
                  href="/suppliers"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  For Suppliers
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  How It Works
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-primary-foreground/70 transition-colors hover:text-accent"
                >
                  Pricing
                </Link>
                <div className="mt-4 flex flex-col gap-3 border-t border-primary-foreground/10 pt-4">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90">
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
