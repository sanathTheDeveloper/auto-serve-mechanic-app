"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wrench,
  ArrowRight,
  Car,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Welcome Hero Section */}
      <section className="relative px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-lg mb-8">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-base font-semibold text-slate-700">
                Welcome to Auto Serve
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-6 leading-tight">
              Let&apos;s Set Up Your
              <br />
              Auto Shop Dashboard
            </h1>

            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Welcome! You&apos;re just a few steps away from transforming how
              you manage your automotive service business. Let&apos;s get your
              digital workspace ready.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth?mode=signup">
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold shadow-xl rounded-xl">
                  <Wrench className="h-5 w-5 mr-3" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </Link>

              <Link href="/auth?mode=login">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-700 px-10 py-4 text-lg font-semibold border border-blue-200 rounded-xl"
                >
                  <PlayCircle className="h-5 w-5 mr-3" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Set Up Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-4">
              What We&apos;ll Set Up Together
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              In just a few minutes, we&apos;ll configure everything you need to
              start managing your auto shop digitally
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Shop Information */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Car className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Shop Profile
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Basic information, location, hours, and contact details for
                  your automotive service business
                </p>
                <div className="flex items-center justify-center text-xs text-blue-600 font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  2-3 minutes
                </div>
              </CardContent>
            </Card>

            {/* Services & Pricing */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Services & Pricing
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Configure your service offerings, pricing structure, and
                  specialties to match your business
                </p>
                <div className="flex items-center justify-center text-xs text-amber-600 font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  3-4 minutes
                </div>
              </CardContent>
            </Card>

            {/* Team & Capacity */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Team & Capacity
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Set up your service bays, team size, and daily capacity for
                  optimal scheduling
                </p>
                <div className="flex items-center justify-center text-xs text-blue-600 font-medium">
                  <Clock className="h-3 w-3 mr-1" />2 minutes
                </div>
              </CardContent>
            </Card>

            {/* Payment Setup */}
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border border-blue-200/50 hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">
                  Payment & Business
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Configure payment methods and business details to start
                  accepting payments
                </p>
                <div className="flex items-center justify-center text-xs text-slate-600 font-medium">
                  <Clock className="h-3 w-3 mr-1" />3 minutes
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Happens Next Section */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-4">
              What Happens After Setup?
            </h2>
            <p className="text-lg text-slate-600">
              Once we finish the setup, you&apos;ll have immediate access to
              your professional dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Instant Dashboard Access
              </h3>
              <p className="text-slate-600">
                Get immediate access to your personalized auto shop management
                dashboard with all features ready to use.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Start Managing Today
              </h3>
              <p className="text-slate-600">
                Begin scheduling appointments, managing customer communications,
                and tracking your business performance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Customer App Integration
              </h3>
              <p className="text-slate-600">
                Your customers can immediately start booking appointments and
                tracking their service progress through our mobile app.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Start CTA */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-blue-200/50">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                The setup process is quick, easy, and designed specifically for
                auto shop owners. Let&apos;s build your digital workspace
                together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth?mode=signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold shadow-xl rounded-xl">
                    <Wrench className="h-5 w-5 mr-3" />
                    Begin Setup Now
                    <ArrowRight className="h-5 w-5 ml-3" />
                  </Button>
                </Link>

                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>No technical knowledge required</span>
                </div>
              </div>

              <div className="mt-6 text-xs text-slate-500">
                Estimated completion time: 10-15 minutes
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-blue-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2">
            Auto Serve
          </div>
          <p className="text-slate-600 text-sm">
            Modern sunset-inspired automotive service management
          </p>
        </div>
      </footer>
    </div>
  );
}
