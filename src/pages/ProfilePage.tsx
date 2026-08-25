import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getUserByUsernameApi } from '@/api/user.api';
import { getSellerReviewsApi } from '@/api/review.api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {Pencil, Star} from 'lucide-react';

interface User {
    id:          number;
    username:    string;
    email:       string;
    firstname:   string;
    lastname:    string;
    phoneNumber: string | null;
    avatarUrl:   string | null;
    isActive:    boolean;
    roles:       { id: number; name: string; createdAt: string; }[];
}

interface Review {
    id:        number;
    rating:    number;
    comment:   string | null;
    reviewer:  { id: number; username: string; } | null;
    createdAt: string;
}

export default function ProfilePage() {
    const { username }          = useParams();
    const navigate              = useNavigate();
    const { user: authUser }    = useAuthStore();
    const [user, setUser]       = useState<User | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const isOwnProfile  = authUser?.username === username;
    const averageRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userResult    = await getUserByUsernameApi(username!);
                setUser(userResult.data);
                const reviewsResult = await getSellerReviewsApi(username!);
                setReviews(reviewsResult.data);
            } catch {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [username]);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
    if (!user) return null;

    const memberSince = user.roles.length > 0
        ? new Date(user.roles[0].createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : '';

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            {/* Profile Header */}
            <div className="flex items-center gap-8 pb-8 border-b border-gray-200">
                {/* Avatar */}
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 shadow-md">
                        {user.firstname[0]}{user.lastname[0]}
                    </div>
                )}

                {/* Info */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{user.firstname} {user.lastname}</h1>
                    <p className="text-gray-500 text-sm">@{user.username}</p>

                    {/* Stats bar */}
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        {reviews.length > 0 && (
                            <>
                                <div className="flex items-center gap-1">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-medium text-black">{averageRating.toFixed(1)}</span>
                                </div>
                                <span className="text-gray-300">|</span>
                                <span>{reviews.length} reviews</span>
                                <span className="text-gray-300">|</span>
                            </>
                        )}
                        {memberSince && <span>Member since {memberSince}</span>}
                    </div>

                    {/* Roles */}
                    <div className="flex gap-2 mt-2">
                        {user.roles.map(role => (
                            <span key={role.id} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {role.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Edit button */}
                {isOwnProfile && (
                    <Button variant="outline" onClick={() => navigate(`/profile/${username}/edit`)}>
                        <Pencil size={14} />
                        Edit Profile
                    </Button>
                )}
            </div>

            {/* Reviews */}
            <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">
                    Reviews {reviews.length > 0 && `(${reviews.length})`}
                </h2>
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                        <Star size={40} className="text-gray-200" />
                        <p className="font-medium">No reviews yet</p>
                        <p className="text-sm">Reviews will appear here after completed orders</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {reviews.map(review => (
                            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {review.reviewer?.username[0].toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium">@{review.reviewer?.username}</span>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                size={14}
                                                className={star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                                            />
                                        ))}
                                    </div>
                                </div>
                                {review.comment && (
                                    <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(review.createdAt).toLocaleDateString('el-GR')}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}