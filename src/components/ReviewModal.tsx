import { useState } from 'react';
import { createReviewApi } from '@/api/review.api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Props {
    orderId:        number;
    sellerUsername: string;
    open:           boolean;
    onClose:        () => void;
    onSuccess:      () => void;
}

export default function ReviewModal({ orderId, sellerUsername, open, onClose, onSuccess }: Props) {
    const [rating, setRating]   = useState(0);
    const [hover, setHover]     = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        setLoading(true);
        try {
            await createReviewApi({ orderId, rating, comment: comment || undefined });
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Leave a Review</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-4 mt-2">
                    <p className="text-sm text-gray-500">
                        Rate your experience with <span className="font-medium">@{sellerUsername}</span>
                    </p>

                    {/* Stars */}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(star)}
                                className="text-3xl transition-colors"
                            >
                                <span className={star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-200'}>
                                    ★
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Comment (optional)</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            placeholder="Share your experience..."
                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}