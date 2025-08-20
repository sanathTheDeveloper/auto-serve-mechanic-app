import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Calendar, Car, MessageSquare, Check, X } from "lucide-react";
import { Review } from "@/types/review";
import { format } from "date-fns";

interface ReviewCardProps {
  review: Review;
  onReplySubmit: (reviewId: string, replyText: string) => void;
}

export function ReviewCard({ review, onReplySubmit }: ReviewCardProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-amber-400 text-amber-400"
            : "fill-gray-200 text-gray-300"
        }`}
      />
    ));
  };


  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const handleStartReply = () => {
    setIsReplying(true);
    setReplyText("");
  };

  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onReplySubmit(review.id, replyText.trim());
      setIsReplying(false);
      setReplyText("");
    } catch (error) {
      console.error('Failed to submit reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white shadow-card hover-lift transition-all border-slate-200">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-semibold text-sm">
                {review.customerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{review.customerName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
                <span className={`font-medium ${getRatingColor(review.rating)}`}>
                  {review.rating}.0
                </span>
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(review.date), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!review.reply && (
              <Badge variant="outline" className="text-amber-600 border-amber-200">
                Needs Reply
              </Badge>
            )}
          </div>
        </div>

        {/* Service Context */}
        <div className="bg-slate-50 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Car className="h-4 w-4" />
            <span className="font-medium">
              RE: {review.serviceContext.serviceType}
            </span>
            <span className="text-slate-400">•</span>
            <span>
              {review.serviceContext.vehicleMake} {review.serviceContext.vehicleModel}
            </span>
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <p className="text-slate-700 leading-relaxed">{review.reviewText}</p>
        </div>

        {/* Existing Reply */}
        {review.reply && (
          <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Your Reply</span>
              <span className="text-sm text-blue-600">
                {format(new Date(review.reply.replyDate), "MMM d, yyyy")}
              </span>
            </div>
            <p className="text-blue-800 text-sm leading-relaxed">{review.reply.replyText}</p>
          </div>
        )}

        {/* Reply Interface */}
        {!review.reply && !isReplying && (
          <div className="pt-4 border-t border-slate-200">
            <Button 
              onClick={handleStartReply}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Reply
            </Button>
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="pt-4 border-t border-slate-200 animate-slide-up">
            <div className="space-y-3">
              <Textarea
                placeholder="Write a professional response to this review..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {replyText.length}/500 characters
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelReply}
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitReply}
                    disabled={!replyText.trim() || isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    {isSubmitting ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}