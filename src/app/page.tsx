"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Wrench,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FeatureCard } from "@/components/FeatureCard";
import { FeatureCarousel } from "@/components/FeatureCarousel";

export default function CustomerIntroPage() {
  const features = [
    {
      icon: Calendar,
      title: "Book Services",
      description: "Schedule appointments with your favorite auto shops instantly. No more phone calls or waiting.",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Watch your car's service progress live with photo updates and estimated completion times.",
      gradient: "bg-gradient-to-br from-amber-500 to-orange-500"
    },
    {
      icon: FileText,
      title: "Digital History",
      description: "Access all service records, receipts, and maintenance history in one secure place.",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-500"
    },
    {
      icon: MapPin,
      title: "Shop Discovery",
      description: "Find trusted mechanics near you with verified reviews and transparent pricing.",
      gradient: "bg-gradient-to-br from-slate-600 to-slate-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-amber-100">
      {/* Header Section */}
      <section className="px-6 py-6 text-center">
        <div className="max-w-6xl mx-auto">
          {/* Logo Section */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Auto Serve Logo"
                width={100}
                height={100}
                className="object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-800 to-amber-700 bg-clip-text text-transparent mb-4">
              Auto Serve
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed">
              Your Ride, Perfected Here
            </p>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-6 py-4">
        <div className="max-w-full mx-auto">
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

      {/* Call to Action Section */}
      <section className="px-6 py-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth?mode=signup">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-10 py-3 text-lg font-semibold shadow-xl rounded-xl transition-all hover:scale-105">
                <Wrench className="h-5 w-5 mr-2" />
                Build Your Shop
              </Button>
            </Link>
            
            <Link href="/auth?mode=login">
              <Button 
                variant="outline"
                className="bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 text-slate-700 px-10 py-3 text-lg font-semibold border border-blue-200 rounded-xl transition-all hover:scale-105"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
