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
    <header className="sticky top-0 z-50 w-full border-b border-primary-foreground/10 bg-primary backdrop-blur supports-[backdrop-filter]:bg-primary/95">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold tracking-tight text-primary-foreground">
              food<span className="text-accent">X</span>trade
            </span>
          </Link>
          
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/products"
              className="group relative text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              Products
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/buyers"
              className="group relative text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              For Buyers
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/suppliers"
              className="group relative text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              For Suppliers
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/how-it-works"
              className="group relative text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/pricing"
              className="group relative text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all group-hover:w-full" />
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-accent text-accent-foreground font-semibold hover:bg-accent/90 shadow-lg shadow-accent/20">
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
