"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  Clock,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
  };

  const handleGoogleAuth = () => {
    // TODO: Implement Google OAuth
    console.log("Google authentication clicked");
    router.push("/dashboard");
  };

  const handleFacebookAuth = () => {
    // TODO: Implement Facebook OAuth
    console.log("Facebook authentication clicked");
    router.push("/dashboard");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log("Form submitted:", mode);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header with Back Button */}
      <header className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Welcome</span>
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
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </h1>

            <p className="text-slate-600">
              {mode === "login"
                ? "Sign in to access your auto shop dashboard"
                : "Join thousands of auto shop owners managing their business digitally"}
            </p>
          </div>

          {/* Auth Card */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-200/50">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-slate-800 text-center">
                {mode === "login" ? "Sign In" : "Get Started"}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Social Auth Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-gray-50 border border-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <Button
                  onClick={handleFacebookAuth}
                  variant="outline"
                  className="w-full h-12 bg-[#1877F2] hover:bg-[#166FE5] border-[#1877F2] text-white font-medium rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Auth Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-slate-700 mb-2"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="shopName"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Shop Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          id="shopName"
                          type="text"
                          placeholder="John's Auto Service"
                          className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

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
                      className="pl-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "signup" && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                      />
                      <span className="ml-2 text-sm text-slate-600">
                        Remember me
                      </span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>

              {/* Mode Toggle */}
              <div className="text-center pt-4">
                <p className="text-slate-600">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={handleToggleMode}
                    className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section for Signup */}
          {mode === "signup" && (
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Why Choose Auto Serve?
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm text-slate-600">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <span>Free Setup</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <span>24/7 Access</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>
          )}
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
