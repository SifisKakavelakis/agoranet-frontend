import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getWishlistApi } from '@/api/wishlist.api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';

interface Product {
    id:          number;
    title:       string;
    price:       number;
    images:      { url: string; isPrimary: boolean; }[];
    seller:      { id: number; username: string; } | null;
    category:    { id: number; name: string; } | null;
}

export default function WishlistPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading]   = useState(true);
    const navigate                = useNavigate();

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const result = await getWishlistApi();
                setProducts(result.data);
            } finally {
                setLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="text-6xl">🤍</div>
                    <h2 className="text-xl font-bold">Save your favourites</h2>
                    <p className="text-gray-400 text-sm">Favourite some items and find them here</p>
                    <Button onClick={() => navigate('/')}>Browse</Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}