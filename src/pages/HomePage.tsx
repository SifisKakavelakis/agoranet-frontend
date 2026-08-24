import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { getProductsApi } from '@/api/product.api';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Product {
    id:          number;
    title:       string;
    price:       number;
    images:      { url: string; isPrimary: boolean; }[];
    seller:      { id: number; username: string; } | null;
    category:    { id: number; name: string; } | null;
}

const LIMIT = 20;

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts]         = useState<Product[]>([]);
    const [loading, setLoading]           = useState(true);
    const [totalPages, setTotalPages]     = useState(1);
    const [total, setTotal]               = useState(0);

    const search   = searchParams.get('search') || '';
    const category = searchParams.get('category')
        ? parseInt(searchParams.get('category')!)
        : undefined;
    const page     = searchParams.get('page')
        ? parseInt(searchParams.get('page')!)
        : 1;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const result = await getProductsApi({ search, category, page, limit: LIMIT });
                setProducts(result.data);
                setTotalPages(result.totalPages);
                setTotal(result.total);
            } catch {
                console.error('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [search, category, page]);

    const handlePageChange = (newPage: number) => {
        const params: Record<string, string> = {};
        if (search)   params.search   = search;
        if (category) params.category = String(category);
        params.page = String(newPage);
        setSearchParams(params);
        window.scrollTo(0, 0);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Results count */}
            {!loading && (
                <p className="text-sm text-gray-400 mb-4">{total} products found</p>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 text-gray-400">No products found</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft size={16} />
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                        .map((p, idx, arr) => (
                            <>
                                {idx > 0 && arr[idx - 1] !== p - 1 && (
                                    <span key={`dots-${p}`} className="text-gray-400">...</span>
                                )}
                                <Button
                                    key={p}
                                    variant={p === page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handlePageChange(p)}
                                >
                                    {p}
                                </Button>
                            </>
                        ))
                    }

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        <ChevronRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
}