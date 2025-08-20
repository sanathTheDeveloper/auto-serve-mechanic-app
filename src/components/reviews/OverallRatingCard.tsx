import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { ReviewStats } from "@/types/review";

interface OverallRatingCardProps {
  stats: ReviewStats;
}

export function OverallRatingCard({ stats }: OverallRatingCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "fill-amber-400 text-amber-400"
            : i < rating
            ? "fill-amber-200 text-amber-400"
            : "fill-gray-200 text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-amber-50 border-blue-200/50 shadow-card hover-lift">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {renderStars(stats.averageRating)}
          </div>
          <span className="text-2xl font-bold text-slate-800">
            {stats.averageRating.toFixed(1)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-amber-600 bg-clip-text text-transparent">
              {stats.totalReviews}
            </p>
            <p className="text-sm text-slate-600">Total Reviews</p>
          </div>
          
          {stats.pendingReplies > 0 && (
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-3">
              <p className="text-sm font-medium text-amber-800">
                {stats.pendingReplies} review{stats.pendingReplies !== 1 ? 's' : ''} awaiting response
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}