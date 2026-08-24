import { Link, useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { toggleWishlistApi, checkWishlistApi } from '@/api/wishlist.api';

interface ProductImage {
    url:       string;
    isPrimary: boolean;
}

interface Product {
    id:          number;
    title:       string;
    price:       number;
    images:      ProductImage[];
    seller:      { id: number; username: string; } | null;
    category:    { id: number; name: string; } | null;
}

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { isAuth }                  = useAuthStore();
    const navigate                    = useNavigate();
    const [inWishlist, setInWishlist] = useState(false);

    const checkWishlist = useCallback(() => {
        if (isAuth()) {
            checkWishlistApi(product.id)
                .then(res => setInWishlist(res.inWishlist))
                .catch((err) => { void err; });
        }
    }, [product.id, isAuth]);

    useEffect(() => {
        checkWishlist();
    }, [checkWishlist]);

    const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];

    const handleBuyNow = () => {
        if (!isAuth()) {
            navigate('/login');
            return;
        }
        navigate(`/checkout/${product.id}`);
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isAuth()) {
            navigate('/login');
            return;
        }
        try {
            const result = await toggleWishlistApi(product.id);
            setInWishlist(result.added);
        } catch (err) { void err; }
    };

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative">
                <Link to={`/products/${product.id}`}>
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                        {primaryImage ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}${primaryImage.url}`}
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image
                            </div>
                        )}
                    </div>
                </Link>
                {/* Wishlist button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                >
                    <span className={inWishlist ? 'text-red-500' : 'text-gray-400'}>
                        {inWishlist ? '❤️' : '🤍'}
                    </span>
                </button>
            </div>

            {/* Info */}
            <div className="p-4">
                <Link to={`/products/${product.id}`}>
                    <h3 className="font-medium text-sm truncate hover:underline">{product.title}</h3>
                </Link>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500">{product.category?.name}</p>
                    {product.seller && (
                        <Link
                            to={`/profile/${product.seller.username}`}
                            className="text-xs text-gray-400 hover:underline"
                            onClick={e => e.stopPropagation()}
                        >
                            @{product.seller.username}
                        </Link>
                    )}
                </div>
                <div className="flex items-center justify-between mt-3">
                    <span className="font-bold">€{product.price}</span>
                    <Button size="sm" onClick={handleBuyNow}>
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}