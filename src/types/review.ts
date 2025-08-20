export interface Review {
  id: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  reviewText: string;
  date: string;
  serviceContext: {
    vehicleMake: string;
    vehicleModel: string;
    serviceType: string;
  };
  reply?: ReviewReply;
  isPublic: boolean;
}

export interface ReviewReply {
  id: string;
  replyText: string;
  replyDate: string;
  authorName: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  pendingReplies: number;
}

export type ReviewFilter = 'all' | 'replied' | 'no-reply' | 'needs-attention';
export type ReviewSort = 'newest' | 'oldest' | 'rating-high' | 'rating-low';

export interface ReviewFilterState {
  filter: ReviewFilter;
  sort: ReviewSort;
  searchQuery: string;
}