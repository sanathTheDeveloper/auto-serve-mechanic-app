'use client'

import { useState } from 'react'

interface Review {
  id: number
  customerName: string
  avatar: string
  rating: number
  date: string
  service: string
  comment: string
  hasReply: boolean
  reply?: string
  isPublic: boolean
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Star, MessageSquare, TrendingUp } from 'lucide-react'

export function Reviews() {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [replyText, setReplyText] = useState('')

  const reviews = [
    {
      id: 1,
      customerName: 'Lisa Thompson',
      avatar: 'LT',
      rating: 5,
      date: '2024-01-13',
      service: 'Full Service + Oil Change',
      comment: 'Great service! My car runs so much better now. Mike and his team were professional and explained everything clearly. Will definitely be back for future maintenance.',
      hasReply: false,
      isPublic: true
    },
    {
      id: 2,
      customerName: 'Mark Rodriguez',
      avatar: 'MR',
      rating: 4,
      date: '2024-01-11',
      service: 'Brake Service',
      comment: 'Fast and efficient service. Reasonable prices too. The only thing I would improve is the waiting area - could use some magazines or WiFi.',
      hasReply: true,
      reply: 'Thank you for the feedback! We\'ve added free WiFi and updated our reading materials. We appreciate your business!',
      isPublic: true
    },
    {
      id: 3,
      customerName: 'James Wilson',
      avatar: 'JW',
      rating: 5,
      date: '2024-01-10',
      service: 'Engine Diagnostic',
      comment: 'Mike really knows his stuff. Fixed issues other shops couldn\'t figure out. Honest pricing and great communication throughout the process.',
      hasReply: false,
      isPublic: true
    },
    {
      id: 4,
      customerName: 'Sarah Chen',
      avatar: 'SC',
      rating: 3,
      date: '2024-01-08',
      service: 'Tire Rotation',
      comment: 'Service was okay but took longer than expected. Was quoted 45 minutes but ended up waiting over an hour. Work quality was fine though.',
      hasReply: false,
      isPublic: false
    },
    {
      id: 5,
      customerName: 'Robert Kim',
      avatar: 'RK',
      rating: 5,
      date: '2024-01-06',
      service: 'A/C Repair',
      comment: 'Excellent work on my AC system. It\'s working perfectly now and the price was very fair. Highly recommend this shop to anyone.',
      hasReply: true,
      reply: 'Thank you so much! We\'re glad we could get your AC working perfectly again. Stay cool!',
      isPublic: true
    }
  ]

  const handleReviewSelect = (review: Review) => {
    setSelectedReview(review)
    setReplyText('')
  }

  const handlePostReply = () => {
    if (selectedReview && replyText.trim()) {
      console.log('Posting reply:', replyText)
      setReplyText('')
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
        }`}
      />
    ))
  }

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  return (
    <div className="p-6 h-full flex gap-6">
      {/* Reviews List */}
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reviews Management</h1>
          <p className="text-slate-600 mt-1">Manage customer feedback and responses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Average Rating</p>
                  <p className="text-2xl font-bold text-slate-900">{getAverageRating()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(Math.round(parseFloat(getAverageRating())))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Reviews</p>
                  <p className="text-2xl font-bold text-slate-900">{reviews.length}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +2 this week
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Response Rate</p>
                  <p className="text-2xl font-bold text-slate-900">60%</p>
                  <p className="text-sm text-slate-600">{reviews.filter(r => r.hasReply).length} of {reviews.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card 
              key={review.id}
              className={`cursor-pointer transition-all ${
                selectedReview?.id === review.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleReviewSelect(review)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-slate-200 text-slate-700">
                        {review.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-slate-900">{review.customerName}</h4>
                      <p className="text-sm text-slate-600">{review.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <Badge variant={review.isPublic ? 'default' : 'secondary'}>
                      {review.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-700 mb-3 leading-relaxed">
                  &quot;{review.comment}&quot;
                </p>

                {review.hasReply && (
                  <div className="bg-slate-50 p-3 rounded-lg border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-slate-900 mb-1">Your Reply:</p>
                    <p className="text-sm text-slate-700">&quot;{review.reply}&quot;</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 text-sm text-slate-600">
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                  {!review.hasReply && (
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      Needs Reply
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Detail Panel */}
      <div className="w-96">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Review Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedReview ? (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-slate-200 text-slate-700">
                      {selectedReview.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-slate-900">{selectedReview.customerName}</h3>
                    <p className="text-sm text-slate-600">{selectedReview.service}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Customer Review:</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    &quot;{selectedReview.comment}&quot;
                  </p>
                </div>

                {/* Existing Reply */}
                {selectedReview.hasReply && (
                  <div>
                    <h4 className="font-medium text-slate-900 mb-2">Your Current Reply:</h4>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <p className="text-sm text-slate-700">&quot;{selectedReview.reply}&quot;</p>
                    </div>
                  </div>
                )}

                {/* Reply Form */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">
                    {selectedReview.hasReply ? 'Update Reply:' : 'Post Public Reply:'}
                  </h4>
                  <Textarea
                    placeholder="Write a professional response to this review..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="mb-3"
                  />
                  <Button 
                    onClick={handlePostReply}
                    disabled={!replyText.trim()}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {selectedReview.hasReply ? 'Update Reply' : 'Post Public Reply'}
                  </Button>
                </div>

                {/* Review Actions */}
                <div className="space-y-2 pt-4 border-t border-slate-200">
                  <Button variant="outline" className="w-full">
                    {selectedReview.isPublic ? 'Make Private' : 'Make Public'}
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                    Report Review
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">Select a review to view details and respond</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}