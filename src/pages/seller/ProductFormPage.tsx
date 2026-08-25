import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createProductApi, updateProductApi, getProductByIdApi, uploadProductImagesApi, deleteProductImageApi } from '@/api/product.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Clothing' },
    { id: 3, name: 'Home & Garden' },
    { id: 4, name: 'Sports' },
    { id: 5, name: 'Books' },
    { id: 6, name: 'Toys' },
    { id: 7, name: 'Beauty' },
    { id: 8, name: 'Automotive' },
];

interface ExistingImage {
    id:        number;
    url:       string;
    isPrimary: boolean;
}

export default function ProductFormPage() {
    const { id }                                = useParams();
    const navigate                              = useNavigate();
    const isEdit                                = !!id;
    const [title, setTitle]                     = useState('');
    const [description, setDescription]         = useState('');
    const [price, setPrice]                     = useState('');
    const [categoryId, setCategoryId]           = useState('1');
    const [files, setFiles]                     = useState<File[]>([]);
    const [previews, setPreviews]               = useState<string[]>([]);
    const [existingImages, setExistingImages]   = useState<ExistingImage[]>([]);
    const [loading, setLoading]                 = useState(false);

    useEffect(() => {
        if (isEdit) {
            getProductByIdApi(Number(id)).then(result => {
                const p = result.data;
                setTitle(p.title);
                setDescription(p.description || '');
                setPrice(p.price.toString());
                setCategoryId(p.category?.id.toString() || '1');
                if (p.images?.length > 0) {
                    setExistingImages(p.images);
                }
            });
        }
    }, [id]);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        setFiles(prev => [...prev, ...selected]);
        setPreviews(prev => [...prev, ...selected.map(f => URL.createObjectURL(f))]);
    };

    const handleRemoveNew = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveExisting = async (imageId: number) => {
        try {
            await deleteProductImageApi(Number(id), imageId);
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
            toast.success('Image deleted successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete image');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await updateProductApi(Number(id), {
                    title,
                    description,
                    price:      parseFloat(price),
                    categoryId: parseInt(categoryId),
                });
                if (files.length > 0) {
                    await uploadProductImagesApi(Number(id), files);
                }
                toast.success('Product updated successfully');
            } else {
                const result = await createProductApi({
                    title,
                    description,
                    price:      parseFloat(price),
                    categoryId: parseInt(categoryId),
                });
                if (files.length > 0) {
                    await uploadProductImagesApi(result.data.id, files);
                }
                toast.success('Product listed successfully');
            }
            navigate('/dashboard');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-8">
                {isEdit ? 'Edit Product' : 'List an Item'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left — Image Upload */}
                <div>
                    <Label className="mb-2 block">Photos</Label>

                    {/* Upload area */}
                    <label
                        htmlFor="images"
                        className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mb-3"
                    >
                        <div className="flex flex-col items-center gap-2 text-gray-400">
                            <ImagePlus size={32} />
                            <p className="text-sm">Click to upload photos</p>
                            <p className="text-xs">JPEG, PNG, WEBP up to 5MB</p>
                        </div>
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleFiles}
                            className="hidden"
                        />
                    </label>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-2">
                            <p className="text-xs text-gray-400 mb-2">Current photos</p>
                            <div className="grid grid-cols-3 gap-2">
                                {existingImages.map(img => (
                                    <div key={img.id} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}${img.url}`}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExisting(img.id)}
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-75"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    {previews.length > 0 && (
                        <div>
                            <p className="text-xs text-gray-400 mb-2">New photos</p>
                            <div className="grid grid-cols-3 gap-2">
                                {previews.map((src, i) => (
                                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNew(i)}
                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-75"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right — Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="price">Price (€)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                        >
                            {CATEGORIES.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-3 mt-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'List Item'}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => navigate('/dashboard')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}