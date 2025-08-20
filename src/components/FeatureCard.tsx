import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export function FeatureCard({ icon: Icon, title, description, gradient }: FeatureCardProps) {
  return (
    <Card className="w-96 h-72 bg-white/95 backdrop-blur-sm border border-blue-200/50 transition-all duration-300 hover:scale-105 cursor-pointer flex-shrink-0">
      <CardContent className="p-8 text-center h-full flex flex-col justify-center">
        <div className={`w-16 h-16 ${gradient} rounded-3xl mx-auto mb-6 flex items-center justify-center`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">
          {title}
        </h3>
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}