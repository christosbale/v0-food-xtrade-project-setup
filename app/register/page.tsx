import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center bg-muted/30 py-12">
        <div className="container-boxed w-full max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Join foodXtrade</h1>
            <p className="mt-2 text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="relative overflow-hidden border-2 transition-all hover:border-secondary hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <Building2 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="mt-4">I'm a Supplier</CardTitle>
                <CardDescription className="leading-relaxed">
                  List your products, receive RFQs, and connect with buyers worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>List unlimited products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Receive buyer requests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access analytics dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Verified supplier badge</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link href="/register/supplier">
                    Register as Supplier
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 transition-all hover:border-secondary hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                  <ShoppingCart className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="mt-4">I'm a Buyer</CardTitle>
                <CardDescription className="leading-relaxed">
                  Browse products, submit RFQs, and find verified suppliers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Access verified suppliers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Submit RFQs instantly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Compare multiple offers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Secure transactions</span>
                  </li>
                </ul>
                <Button asChild className="mt-6 w-full">
                  <Link href="/register/buyer">
                    Register as Buyer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="font-medium text-secondary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
