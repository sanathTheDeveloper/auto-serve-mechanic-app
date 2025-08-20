"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, MapPin, Wrench, LogIn } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FeatureCard } from "@/components/FeatureCard";
import { FeatureCarousel } from "@/components/FeatureCarousel";

export default function CustomerIntroPage() {
  const features = [
    {
      icon: Calendar,
      title: "Book Services",
      description:
        "Schedule appointments with your favorite auto shops instantly. No more phone calls or waiting.",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Watch your car's service progress live with photo updates and estimated completion times.",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    },
    {
      icon: FileText,
      title: "Digital History",
      description:
        "Access all service records, receipts, and maintenance history in one secure place.",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-500",
    },
    {
      icon: MapPin,
      title: "Shop Discovery",
      description:
        "Find trusted mechanics near you with verified reviews and transparent pricing.",
      gradient: "bg-gradient-to-br from-slate-600 to-slate-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header Section - Compact for single screen */}
      <section className="px-8 py-8 text-center relative">
        {/* Background decorative elements - enhanced for tablet */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-8 -right-16 w-28 h-28 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-blue-100/40 to-sky-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Logo Section - Compact for single screen */}
          <div className="mb-8">
            {/* Logo - Compact for single screen */}
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-24 h-24 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Auto Serve Logo"
                    width={96}
                    height={96}
                    className="object-contain drop-shadow-xl"
                    priority
                  />
                </div>
              </div>

              {/* Enhanced Tagline - Compact for single screen */}
              <p className="text-xl text-slate-700 font-semibold mb-6 max-w-3xl mx-auto leading-relaxed">
                Professional Auto Shop Management Platform
              </p>
            </div>

            {/* Trust indicators - Compact for single screen */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-600 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">500+ shops</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-medium">24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - Compact for single screen */}
      <section className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <FeatureCarousel>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
              />
            ))}
          </FeatureCarousel>
        </div>
      </section>

      {/* Enhanced CTA Section - Compact for single screen */}
      <section className="px-8 py-10 bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-blue-300/10 rounded-full blur-3xl"></div>
          <div className="absolute top-0 left-1/3 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header - Compact */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-3">
              Ready to Transform Your Auto Shop?
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of professional mechanics who trust Auto Serve to
              manage their business efficiently. Start your digital
              transformation today with our comprehensive platform.
            </p>
          </div>

          {/* Key Benefits Grid - Compact */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Wrench className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Easy Setup
              </h3>
              <p className="text-sm text-slate-600">
                Get started in minutes with our intuitive onboarding process
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                24/7 Access
              </h3>
              <p className="text-sm text-slate-600">
                Manage your shop from anywhere, anytime with mobile access
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Complete Control
              </h3>
              <p className="text-sm text-slate-600">
                Full visibility into every aspect of your auto shop operations
              </p>
            </div>
          </div>

          {/* CTA Buttons - Compact for single screen */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth?mode=signup">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-16 py-6 text-xl font-semibold shadow-2xl rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-3xl min-w-[220px]">
                <Wrench className="h-7 w-7 mr-4" />
                Build Your Shop
              </Button>
            </Link>

            <Link href="/auth?mode=login">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-700 px-16 py-6 text-xl font-semibold border-2 border-blue-200 rounded-3xl transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[220px]"
              >
                <LogIn className="h-7 w-7 mr-4" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Additional Trust Elements - Compact */}
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500 mb-3">
              Trusted by auto shops nationwide
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <span>✓ No setup fees</span>
              <span>✓ 30-day free trial</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
