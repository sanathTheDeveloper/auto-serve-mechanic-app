"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log("Password reset requested for:", email);
    router.push("/dashboard");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
        {/* Header with Back Button */}
        <header className="px-6 py-6">
          <div className="max-w-6xl mx-auto">
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Sign In</span>
            </Link>
          </div>
        </header>

        {/* Success Content */}
        <div className="flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-200/50">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <h1 className="text-2xl font-bold text-slate-800 mb-4">
                  Check Your Email
                </h1>

                <p className="text-slate-600 mb-6">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>. Please check your email and click
                  the link to reset your password.
                </p>

                <div className="space-y-3">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl"
                  >
                    Go to Dashboard
                  </Button>

                  <Link href="/auth">
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                    >
                      Return to Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="px-6 py-8 border-t border-blue-200/50 bg-white/50 backdrop-blur-sm mt-auto">
          <div className="max-w-6xl mx-auto text-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2">
              Auto Serve
            </div>
            <p className="text-slate-600 text-sm">
              Modern automotive service management platform
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header with Back Button */}
      <header className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Sign In</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg mb-6">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-base font-semibold text-slate-700">
                Auto Serve
              </span>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h1>

            <p className="text-slate-600">
              No worries! Enter your email address and we&apos;ll send you a
              link to reset your password.
            </p>
          </div>

          {/* Reset Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-200/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-800 text-center">
                Reset Your Password
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send Reset Link
                </Button>
              </form>

              <div className="text-center pt-4">
                <p className="text-slate-600">
                  Remember your password?{" "}
                  <Link
                    href="/auth"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Having trouble? Contact our support team at{" "}
              <a
                href="mailto:support@autoserve.com"
                className="text-blue-600 hover:text-blue-700"
              >
                support@autoserve.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-blue-200/50 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2">
            Auto Serve
          </div>
          <p className="text-slate-600 text-sm">
            Modern automotive service management platform
          </p>
        </div>
      </footer>
    </div>
  );
}
