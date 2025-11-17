import Link from 'next/link'
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-accent/15 bg-primary">
      <div className="container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-tight text-primary-foreground">
                food<span className="text-accent">X</span>trade
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              Connecting food suppliers and buyers worldwide with a trusted B2B marketplace platform.
            </p>
            <div className="flex gap-4 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary-foreground">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/suppliers"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  For Suppliers
                </Link>
              </li>
              <li>
                <Link
                  href="/buyers"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  For Buyers
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary-foreground">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-primary-foreground">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/compliance"
                  className="text-sm text-primary-foreground/60 transition-colors hover:text-accent"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-primary-foreground/10 pt-8">
          <p className="text-center text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} foodXtrade. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
