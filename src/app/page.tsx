"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, MapPin, Wrench, LogIn } from "lucide-react";
import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import { FeatureCarousel } from "@/components/FeatureCarousel";
import { Logo } from "@/components/Logo";

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
      {/* Header Section - Responsive spacing */}
      <section className="px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10 text-center relative">
        {/* Background decorative elements - responsive positioning */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -left-8 w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-200/30 to-blue-300/20 rounded-full blur-2xl"></div>
          <div className="absolute -top-4 -right-8 w-16 h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-amber-200/30 to-orange-300/20 rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 left-1/4 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100/40 to-sky-200/30 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Logo Section - Responsive spacing */}
          <div className="mb-4 md:mb-6 lg:mb-8">
            {/* Logo - Responsive sizing with reduced gap */}
            <div className="mb-2 md:mb-3 lg:mb-4">
              <div className="flex items-center justify-center mb-1 md:mb-2 lg:mb-3 animate-fade-in">
                <Logo size="2xl" />
              </div>

              {/* Tagline - Reduced gap with animation */}
              <p className="text-base md:text-lg lg:text-xl text-slate-700 font-semibold mb-3 md:mb-4 lg:mb-6 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed animate-slide-up">
                Professional Auto Shop Management Platform
              </p>
            </div>

            {/* Trust indicators - Responsive layout with animation */}
            <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-6 text-xs md:text-sm lg:text-base text-slate-600 mb-3 md:mb-4 lg:mb-6 animate-fade-in-delay">
              <div className="flex items-center gap-1.5 md:gap-2 animate-bounce-in">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">500+ shops</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 animate-bounce-in-delay-1">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-amber-500 rounded-full"></div>
                <span className="font-medium">24/7 support</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 animate-bounce-in-delay-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section - Responsive spacing */}
      <section className="px-4 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6">
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

      {/* CTA Section - Responsive spacing */}
      <section className="px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 bg-gradient-to-br from-white/80 to-blue-50/60 backdrop-blur-sm relative">
        {/* Background decorative elements - responsive */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 right-0 w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-200/20 to-blue-300/10 rounded-full blur-2xl"></div>
          <div className="absolute top-0 left-1/3 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-amber-200/20 to-orange-300/10 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header - Responsive */}
          <div className="text-center mb-4 md:mb-6 lg:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-2 md:mb-3 lg:mb-4">
              Ready to Transform Your Auto Shop?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
              Join hundreds of professional mechanics who trust Auto Serve to
              manage their business efficiently. Start your digital
              transformation today with our comprehensive platform.
            </p>
          </div>

          {/* Key Benefits Grid - Responsive spacing */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-5 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                <Wrench className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1 md:mb-2 lg:mb-3">
                Easy Setup
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-slate-600">
                Get started in minutes with our intuitive onboarding process
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                <Clock className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1 md:mb-2 lg:mb-3">
                24/7 Access
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-slate-600">
                Manage your shop from anywhere, anytime with mobile access
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg md:rounded-xl lg:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-3 shadow-lg">
                <FileText className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-800 mb-1 md:mb-2 lg:mb-3">
                Complete Control
              </h3>
              <p className="text-xs md:text-sm lg:text-base text-slate-600">
                Full visibility into every aspect of your auto shop operations
              </p>
            </div>
          </div>

          {/* CTA Buttons - Responsive sizing */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <Link href="/auth?mode=signup">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 md:px-10 lg:px-12 py-4 md:py-5 text-base md:text-lg font-semibold shadow-lg md:shadow-xl rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-[160px] md:min-w-[180px] lg:min-w-[200px]">
                <Wrench className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                Build Your Shop
              </Button>
            </Link>

            <Link href="/auth?mode=login">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-700 px-8 md:px-10 lg:px-12 py-4 md:py-5 text-base md:text-lg font-semibold border-2 border-blue-200 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-[160px] md:min-w-[180px] lg:min-w-[200px]"
              >
                <LogIn className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                Sign In
              </Button>
            </Link>
          </div>

          {/* Additional Trust Elements - Responsive */}
          <div className="text-center mt-4 md:mt-5 lg:mt-6">
            <p className="text-xs md:text-sm text-slate-500 mb-1 md:mb-2 lg:mb-3">
              Trusted by auto shops nationwide
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 text-xs text-slate-400">
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
