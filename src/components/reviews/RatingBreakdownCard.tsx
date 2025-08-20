import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import { ReviewStats } from "@/types/review";

interface RatingBreakdownCardProps {
  stats: ReviewStats;
}

export function RatingBreakdownCard({ stats }: RatingBreakdownCardProps) {
  const ratingLabels = [5, 4, 3, 2, 1];

  const getPercentage = (count: number) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };


  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-card hover-lift border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Rating Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {ratingLabels.map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = getPercentage(count);
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-sm font-medium text-slate-700">{rating}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                
                <div className="flex-1">
                  <Progress 
                    value={percentage} 
                    className="h-2"
                  />
                  <style jsx>{`
                    [data-radix-progress-indicator] {
                      background-color: ${rating === 5 ? '#10b981' : 
                                         rating === 4 ? '#84cc16' : 
                                         rating === 3 ? '#eab308' : 
                                         rating === 2 ? '#f97316' : '#ef4444'} !important;
                    }
                  `}</style>
                </div>
                
                <div className="w-12 text-right">
                  <span className="text-sm font-medium text-slate-600">
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Response Rate</span>
            <span className="font-medium">
              {stats.totalReviews > 0 
                ? Math.round(((stats.totalReviews - stats.pendingReplies) / stats.totalReviews) * 100)
                : 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}