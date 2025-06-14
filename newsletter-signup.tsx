import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Github, Twitter, Facebook } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Logo/Brand Mark */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-white" />
          </div>

          {/* Headlines */}
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">Subscribe to My Newsletter</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Get the latest updates, exclusive content, and insider tips delivered straight to your inbox.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Social Sign-up Options */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <Github className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>

          {/* Email Form */}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <Input id="email" type="email" placeholder="Enter your email" className="h-11" required />
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium"
            >
              Subscribe Now
            </Button>
          </form>

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 underline">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 underline">
                Privacy
              </Link>
              <Link href="/help" className="text-gray-500 hover:text-gray-700 underline">
                Help
              </Link>
            </div>
          </div>

          {/* Trust Indicators Footer */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              🔒 We respect your privacy. Unsubscribe at any time.
              <br />
              No spam, ever. Only valuable content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
