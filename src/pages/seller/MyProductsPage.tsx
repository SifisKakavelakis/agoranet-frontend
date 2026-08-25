import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getMyProductsApi, deleteProductApi } from '@/api/product.api';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Product {
    id:       number;
    title:    string;
    price:    number;
    isActive: boolean;
    images:   { url: string; isPrimary: boolean; }[];
    category: { id: number; name: string; } | null;
}

export default function MyProductsPage() {
    const navigate                        = useNavigate();
    const [products, setProducts]         = useState<Product[]>([]);
    const [loading, setLoading]           = useState(true);
    const [deleteId, setDeleteId]         = useState<number | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const result = await getMyProductsApi();
                setProducts(result.data);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteProductApi(deleteId);
            setProducts(prev => prev.filter(p => p.id !== deleteId));
            toast.success('Product deleted successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete product');
        } finally {
            setDeleteId(null);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-6">My Products</h1>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Package size={48} className="text-gray-200" />
                    <h2 className="text-xl font-bold">No products yet</h2>
                    <p className="text-gray-400 text-sm">Start selling by clicking Sell Now</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {products.map(product => {
                        const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                        return (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex gap-4 items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    {primaryImage ? (
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${primaryImage.url}`}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                                            No image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium">{product.title}</h3>
                                    <p className="text-sm text-gray-500">{product.category?.name}</p>
                                    <p className="text-sm font-bold">€{product.price}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {product.isActive ? 'Active' : 'Sold'}
                                </span>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/products/${product.id}/edit`)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => setDeleteId(product.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}