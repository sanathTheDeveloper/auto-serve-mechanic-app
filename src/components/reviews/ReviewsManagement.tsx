import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import { OverallRatingCard } from "./OverallRatingCard";
import { RatingBreakdownCard } from "./RatingBreakdownCard";
import { ReviewFilters } from "./ReviewFilters";
import { ReviewCard } from "./ReviewCard";
import { Review, ReviewSort, ReviewFilterState } from "@/types/review";
import { mockReviews, getFilteredReviews, sortReviews } from "@/data/reviews";

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [filterState, setFilterState] = useState<ReviewFilterState>({
    filter: 'all',
    sort: 'newest',
    searchQuery: ''
  });

  // Filter and sort reviews (keeping all reviews, just search and sort)
  const filteredAndSortedReviews = useMemo(() => {
    const filtered = getFilteredReviews(reviews, 'all', filterState.searchQuery);
    return sortReviews(filtered, filterState.sort);
  }, [reviews, filterState]);

  // Calculate updated stats
  const currentStats = useMemo(() => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating as keyof typeof acc] = (acc[review.rating as keyof typeof acc] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const pendingReplies = reviews.filter(r => !r.reply).length;

    return {
      averageRating,
      totalReviews,
      ratingDistribution,
      pendingReplies
    };
  }, [reviews]);

  const handleReplySubmit = async (reviewId: string, replyText: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newReply = {
      id: `reply_${Date.now()}`,
      replyText,
      replyDate: new Date().toISOString().split('T')[0],
      authorName: "Mike's Auto Service"
    };

    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, reply: newReply }
          : review
      )
    );
  };


  const handleSortChange = (sort: ReviewSort) => {
    setFilterState(prev => ({ ...prev, sort }));
  };

  const handleSearchChange = (searchQuery: string) => {
    setFilterState(prev => ({ ...prev, searchQuery }));
  };

  return (
    <div className="space-y-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="md:col-span-2 xl:col-span-2">
          <OverallRatingCard stats={currentStats} />
        </div>
        <div className="md:col-span-2 xl:col-span-1">
          <RatingBreakdownCard stats={currentStats} />
        </div>
      </div>

      {/* Filters */}
      <ReviewFilters
        filterState={filterState}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
      />

      {/* Reviews List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 rounded-lg p-4">
          <span className="text-sm font-medium text-slate-600">
            Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
          </span>
          
          {currentStats.pendingReplies > 0 && (
            <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-2 rounded-lg">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">
                {currentStats.pendingReplies} review{currentStats.pendingReplies !== 1 ? 's' : ''} awaiting response
              </span>
            </div>
          )}
        </div>

        {filteredAndSortedReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReplySubmit={handleReplySubmit}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border-slate-200">
            <CardContent className="p-12 text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-600 mb-2">
                No reviews found
              </h3>
              <p className="text-slate-500">
                {filterState.searchQuery || filterState.filter !== 'all'
                  ? "Try adjusting your filters or search terms"
                  : "Customer reviews will appear here as they come in"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}