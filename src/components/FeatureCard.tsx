import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
}: FeatureCardProps) {
  return (
    <Card className="w-[420px] h-96 bg-white/95 backdrop-blur-sm border border-blue-200/50 transition-all duration-500 hover:scale-105 cursor-pointer flex-shrink-0 shadow-xl hover:shadow-2xl hover:border-blue-300/60 group">
      <CardContent className="p-10 text-center h-full flex flex-col justify-center relative overflow-hidden">
        {/* Background decorative element */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 ${gradient} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-500`}
        ></div>

        {/* Icon container with enhanced styling - tablet optimized */}
        <div
          className={`w-24 h-24 ${gradient} rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 relative z-10`}
        >
          <Icon className="h-12 w-12 text-white" />
        </div>

        {/* Content - tablet enhanced */}
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-800 mb-5 group-hover:text-slate-900 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Subtle accent line */}
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 ${gradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-24`}
        ></div>
      </CardContent>
    </Card>
  );
}
