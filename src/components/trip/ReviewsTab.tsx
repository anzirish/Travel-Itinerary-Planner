import { useEffect, useState } from "react";
import * as tripService from "../../services/tripService.firebase";
import type { Trip } from "../../Types/trip";

export default function ReviewsTab({ trip }: { trip: Trip }) {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewerEmails, setReviewerEmails] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // load reviewer emails
  useEffect(() => {
    async function loadReviewerEmails() {
      if (!trip?.reviews) return;
      const emails: Record<string, string> = {};
      for (const r of trip.reviews) {
        if (!reviewerEmails[r.userId]) {
          const snap = await tripService.getUserById(r.userId);
          if (snap?.email) {
            emails[r.userId] = snap.email;
          }
        }
      }
      setReviewerEmails((prev) => ({ ...prev, ...emails }));
    }
    loadReviewerEmails();
  }, [trip, reviewerEmails]);

  const averageRating = trip.reviews?.length 
    ? trip.reviews.reduce((sum, r) => sum + r.rating, 0) / trip.reviews.length
    : 0;

  const ratingDistribution = Array.from({length: 5}, (_, i) => {
    const stars = i + 1;
    const count = trip.reviews?.filter(r => r.rating === stars).length || 0;
    const percentage = trip.reviews?.length ? (count / trip.reviews.length) * 100 : 0;
    return { stars, count, percentage };
  }).reverse();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await tripService.addReview(trip.id, {
        userId: trip.ownerId, // replace with auth.currentUser?.uid
        rating: Number(newRating),
        comment: newComment.trim(),
      });
      setNewRating(5);
      setNewComment("");
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    
    return Array.from({length: 5}, (_, i) => {
      const starNumber = i + 1;
      const isFilled = starNumber <= rating;
      const isHovered = hoveredStar !== null && starNumber <= hoveredStar;
      
      return (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setNewRating(starNumber)}
          onMouseEnter={() => interactive && setHoveredStar(starNumber)}
          onMouseLeave={() => interactive && setHoveredStar(null)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform duration-150 ${!interactive && 'pointer-events-none'}`}
        >
          <svg
            className={`${sizeClasses[size]} ${
              isFilled || isHovered ? 'text-yellow-400' : 'text-slate-600'
            } transition-colors duration-150`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    });
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-600">
      {/* Header with Stats */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Trip Reviews</h3>
              <p className="text-slate-400 text-sm">{trip.reviews?.length || 0} review{(trip.reviews?.length || 0) !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          {trip.reviews?.length ? (
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl font-bold text-yellow-400">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex">
                  {renderStars(Math.round(averageRating), 'sm')}
                </div>
              </div>
              <p className="text-slate-400 text-xs">Average rating</p>
            </div>
          ) : null}
        </div>

        {/* Rating Distribution */}
        {trip.reviews?.length ? (
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center space-x-3">
                <span className="text-slate-300 text-sm w-6">{stars}★</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs w-8">{count}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Add Review Section */}
      <div className="p-6 border-b border-slate-600">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Write a Review
        </h4>
        
        <div className="space-y-4">
          {/* Star Rating Input */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Your Rating
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(hoveredStar || newRating, 'lg', true)}
              </div>
              <span className="text-slate-400 text-sm ml-3">
                {hoveredStar || newRating} star{(hoveredStar || newRating) !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Comment Input */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Your Review
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your experience with this trip..."
              rows={4}
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-slate-500 text-xs">
                {newComment.length}/500 characters
              </span>
              <span className="text-slate-500 text-xs">
                {newComment.trim().split(/\s+/).filter(w => w.length > 0).length} words
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSubmitReview}
              disabled={isSubmitting || !newComment.trim()}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-6">
        {trip.reviews && trip.reviews.length > 0 ? (
          <div className="space-y-4">
            {trip.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/50 p-5 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold">
                      {getInitials(reviewerEmails[review.userId] || 'User')}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-white font-medium">
                          {reviewerEmails[review.userId]?.split('@')[0] || 'Anonymous User'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating, 'sm')}
                        </div>
                        <span className="text-slate-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      {/* Comment */}
                      <p className="text-slate-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  {review.userId === trip.ownerId && (
                    <button
                      onClick={() => tripService.deleteReview(trip.id, review.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0 ml-4"
                      title="Delete review"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-slate-300 font-medium text-lg mb-2">No Reviews Yet</h3>
            <p className="text-slate-400 text-sm">Be the first to share your experience with this trip</p>
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-4 border-t border-slate-600 bg-slate-700/20">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="text-sm">
            <p className="text-slate-300 font-medium mb-1">💡 Review Guidelines</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Share honest feedback about locations, accommodations, and experiences to help future travelers make informed decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}