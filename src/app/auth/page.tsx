"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

type AuthMode = "login" | "signup";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signIn, socialAuth, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    shopName: "",
  });

  // Set initial mode based on URL parameter
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "signup" || urlMode === "login") {
      setMode(urlMode as AuthMode);
    }
  }, [searchParams]);

  const handleToggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    // Reset form when switching modes
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
      shopName: "",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGoogleAuth = async () => {
    try {
      const user = await socialAuth("google");
      // For new users (sign-up), redirect to shop profile setup
      // For existing users (sign-in), redirect to dashboard
      if (user.isNewUser || !user.hasCompletedProfile) {
        router.push("/shop-profile");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google auth failed:", error);
    }
  };

  const handleFacebookAuth = async () => {
    try {
      const user = await socialAuth("facebook");
      // For new users (sign-up), redirect to shop profile setup
      // For existing users (sign-in), redirect to dashboard
      if (user.isNewUser || !user.hasCompletedProfile) {
        router.push("/shop-profile");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Facebook auth failed:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "signup") {
        // Validate required fields for signup
        if (
          !formData.email ||
          !formData.password ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.phone ||
          !formData.shopName
        ) {
          alert("Please fill in all required fields");
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        await signUp({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          shopName: formData.shopName,
        });

        // After successful sign-up, redirect to shop profile setup
        router.push("/shop-profile");
      } else {
        // Login
        if (!formData.email || !formData.password) {
          alert("Please enter your email and password");
          return;
        }

        const user = await signIn(formData.email);

        // For existing users, check if they need to complete profile setup
        if (!user.hasCompletedProfile) {
          router.push("/shop-profile");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Background decorative elements - consistent with landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-10 -right-20 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-100/40 to-sky-200/30 rounded-full blur-2xl"></div>
      </div>

      {/* Header with Back Button - compact styling */}
      <header className="px-6 py-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Welcome</span>
          </Link>
        </div>
      </header>

      {/* Main Content - tablet optimized */}
      <div className="flex items-center justify-center px-8 py-8 relative z-10">
        <div className="w-full max-w-2xl">
          {/* Brand Header - tablet optimized */}
          <div className="text-center mb-8">
            {/* Logo - Enhanced for tablet */}
            <div className="flex items-center justify-center mb-6">
              <Logo size="xl" />
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-3">
              {mode === "login" ? "Welcome Back" : "Create Your Account"}
            </h2>

            <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
              {mode === "login"
                ? "Sign in to access your auto shop dashboard"
                : "Join thousands of auto shop owners managing their business digitally"}
            </p>
          </div>

          {/* Auth Card - tablet enhanced */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border border-blue-200/50 rounded-3xl p-8">
            <CardContent className="space-y-6">
              {/* Social Auth Buttons - tablet enhanced */}
              <div className="space-y-4">
                <Button
                  onClick={handleGoogleAuth}
                  variant="outline"
                  className="w-full h-14 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-medium text-lg rounded-2xl transition-all duration-300 hover:shadow-lg"
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
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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

              {/* Divider - brand-consistent styling */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="px-4 bg-white/95 text-slate-500 font-medium">
                    or continue with email
                  </span>
                </div>
              </div>

              {/* Auth Form - tablet enhanced */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-base font-medium text-slate-700 mb-2"
                        >
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-base font-medium text-slate-700 mb-2"
                        >
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-base font-medium text-slate-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="shopName"
                        className="block text-base font-medium text-slate-700 mb-2"
                      >
                        Shop Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input
                          id="shopName"
                          type="text"
                          placeholder="John's Auto Service"
                          value={formData.shopName}
                          onChange={(e) =>
                            handleInputChange("shopName", e.target.value)
                          }
                          className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-medium text-slate-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="pl-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-base font-medium text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="pl-12 pr-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                      className="block text-base font-medium text-slate-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="pl-12 pr-12 h-12 rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 text-base"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                )}

                {/* Submit Button - brand-consistent styling */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Please wait..."
                    : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
                </Button>
              </form>

              {/* Mode Toggle - tablet enhanced */}
              <div className="text-center pt-4">
                <p className="text-base text-slate-600">
                  {mode === "login"
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    onClick={handleToggleMode}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Section for Signup - tablet enhanced */}
          {mode === "signup" && (
            <div className="mt-8 text-center">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Why Choose Auto Serve?
              </h3>
              <div className="grid grid-cols-3 gap-6 text-sm text-slate-600">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span>Free Setup</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <span>24/7 Access</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
