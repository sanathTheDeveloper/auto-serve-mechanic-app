import { Review, ReviewStats } from '@/types/review';

export const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerAvatar: undefined,
    rating: 5,
    reviewText: 'Exceptional service! The team was professional, transparent about costs, and completed my brake replacement ahead of schedule. My car feels brand new again. Highly recommend this shop for anyone looking for honest, quality work.',
    date: '2024-01-15',
    serviceContext: {
      vehicleMake: 'Toyota',
      vehicleModel: 'Camry',
      serviceType: 'Brake Replacement & Inspection'
    },
    reply: {
      id: 'r1',
      replyText: 'Thank you so much for the wonderful review, Sarah! We\'re thrilled that you had such a positive experience with our brake service. Your safety is our top priority, and it\'s great to hear that your Camry is running smoothly. We look forward to serving you again!',
      replyDate: '2024-01-16',
      authorName: 'Mike\'s Auto Service'
    },
    isPublic: true
  },
  {
    id: '2',
    customerName: 'David Chen',
    customerAvatar: undefined,
    rating: 4,
    reviewText: 'Good service overall. The diagnostic was thorough and they explained everything clearly. The only minor issue was that it took a bit longer than initially estimated, but the quality of work was solid.',
    date: '2024-01-12',
    serviceContext: {
      vehicleMake: 'Honda',
      vehicleModel: 'Civic',
      serviceType: 'Engine Diagnostic & Tune-up'
    },
    reply: undefined,
    isPublic: true
  },
  {
    id: '3',
    customerName: 'Maria Rodriguez',
    customerAvatar: undefined,
    rating: 5,
    reviewText: 'Outstanding customer service! They went above and beyond to help me understand the issues with my car. Fair pricing, excellent communication, and they even gave me a ride home while my car was being serviced. Will definitely be back!',
    date: '2024-01-10',
    serviceContext: {
      vehicleMake: 'Ford',
      vehicleModel: 'F-150',
      serviceType: 'Transmission Service'
    },
    reply: undefined,
    isPublic: true
  },
  {
    id: '4',
    customerName: 'Robert Thompson',
    customerAvatar: undefined,
    rating: 3,
    reviewText: 'The work was done correctly, but I felt the communication could have been better. Had to call twice to get updates on my vehicle. The final result was good though.',
    date: '2024-01-08',
    serviceContext: {
      vehicleMake: 'Chevrolet',
      vehicleModel: 'Silverado',
      serviceType: 'Oil Change & Filter Replacement'
    },
    reply: undefined,
    isPublic: true
  },
  {
    id: '5',
    customerName: 'Jennifer Williams',
    customerAvatar: undefined,
    rating: 5,
    reviewText: 'Fantastic experience from start to finish! They diagnosed my AC issue quickly, provided a fair quote, and had me back on the road the same day. The waiting area was clean and comfortable too.',
    date: '2024-01-05',
    serviceContext: {
      vehicleMake: 'Nissan',
      vehicleModel: 'Altima',
      serviceType: 'A/C Repair & Recharge'
    },
    reply: {
      id: 'r5',
      replyText: 'We\'re so happy we could get your A/C working quickly, Jennifer! Keeping our customers comfortable is important to us, both in their vehicles and in our waiting area. Thank you for choosing us and for the great review!',
      replyDate: '2024-01-06',
      authorName: 'Mike\'s Auto Service'
    },
    isPublic: true
  },
  {
    id: '6',
    customerName: 'Michael Brown',
    customerAvatar: undefined,
    rating: 4,
    reviewText: 'Reliable service with experienced mechanics. They fixed my suspension issue and the ride quality is much improved. Pricing was competitive and they completed the work when promised.',
    date: '2024-01-03',
    serviceContext: {
      vehicleMake: 'BMW',
      vehicleModel: '3 Series',
      serviceType: 'Suspension Repair'
    },
    reply: undefined,
    isPublic: true
  }
];

export const mockReviewStats: ReviewStats = {
  averageRating: 4.3,
  totalReviews: 6,
  ratingDistribution: {
    5: 3,
    4: 2,
    3: 1,
    2: 0,
    1: 0
  },
  pendingReplies: 3
};

export const getFilteredReviews = (
  reviews: Review[],
  filter: string,
  searchQuery: string = ''
): Review[] => {
  let filtered = [...reviews];

  // Apply filter
  switch (filter) {
    case 'replied':
      filtered = filtered.filter(review => review.reply);
      break;
    case 'no-reply':
      filtered = filtered.filter(review => !review.reply);
      break;
    case 'needs-attention':
      filtered = filtered.filter(review => !review.reply && review.rating <= 3);
      break;
    default:
      break;
  }

  // Apply search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(review =>
      review.customerName.toLowerCase().includes(query) ||
      review.reviewText.toLowerCase().includes(query) ||
      review.serviceContext.vehicleMake.toLowerCase().includes(query) ||
      review.serviceContext.vehicleModel.toLowerCase().includes(query) ||
      review.serviceContext.serviceType.toLowerCase().includes(query)
    );
  }

  return filtered;
};

export const sortReviews = (reviews: Review[], sortBy: string): Review[] => {
  const sorted = [...reviews];

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    case 'rating-high':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'rating-low':
      return sorted.sort((a, b) => a.rating - b.rating);
    default:
      return sorted;
  }
};