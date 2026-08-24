import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getProductByIdApi } from '@/api/product.api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

interface Product {
    id:          number;
    title:       string;
    description: string | null;
    price:       number;
    isActive:    boolean;
    images:      { url: string; isPrimary: boolean; }[];
    seller:      { id: number; username: string; } | null;
    category:    { id: number; name: string; } | null;
}

export default function ProductDetailPage() {
    const { id }                            = useParams();
    const navigate                          = useNavigate();
    const { isAuth }                        = useAuthStore();
    const [product, setProduct]             = useState<Product | null>(null);
    const [loading, setLoading]             = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProductByIdApi(Number(id));
                setProduct(result.data);
            } catch {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        if (!isAuth()) {
            navigate('/login');
            return;
        }
        navigate(`/checkout/${id}`);
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;
    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                        {product.images.length > 0 ? (
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}${product.images[selectedImage].url}`}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No image
                            </div>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {product.images.length > 1 && (
                        <div className="flex gap-2">
                            {product.images.map((img, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-black' : 'border-transparent'}`}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}${img.url}`}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="text-sm text-gray-500">{product.category?.name}</p>
                        <h1 className="text-2xl font-bold mt-1">{product.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            by{' '}
                            <Link to={`/profile/${product.seller?.username}`} className="hover:underline font-medium">
                                @{product.seller?.username}
                            </Link>
                        </p>
                    </div>

                    <p className="text-3xl font-bold">€{product.price}</p>

                    {product.description && (
                        <p className="text-sm text-gray-600">{product.description}</p>
                    )}

                    {product.isActive ? (
                        <Button onClick={handleBuyNow} className="w-full">
                            Buy Now
                        </Button>
                    ) : (
                        <Button disabled className="w-full">
                            Sold
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}