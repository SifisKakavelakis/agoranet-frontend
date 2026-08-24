import { useNavigate, useSearchParams } from 'react-router';

const CATEGORIES = [
    { id: 1,  name: 'Electronics' },
    { id: 2,  name: 'Clothing' },
    { id: 3,  name: 'Home & Garden' },
    { id: 4,  name: 'Sports' },
    { id: 5,  name: 'Books' },
    { id: 6,  name: 'Toys' },
    { id: 7,  name: 'Beauty' },
    { id: 8,  name: 'Automotive' },
];

export default function CategoryBar() {
    const navigate                = useNavigate();
    const [searchParams]          = useSearchParams();
    const activeCategory          = searchParams.get('category');

    const handleCategory = (id: number) => {
        if (activeCategory === String(id)) {
            navigate('/');
        } else {
            navigate(`/?category=${id}`);
        }
    };

    return (
        <div className="border-b border-gray-100 bg-white px-6 py-3">
            <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => handleCategory(cat.id)}
                        className={`text-sm whitespace-nowrap hover:text-black transition-colors ${
                            activeCategory === String(cat.id)
                                ? 'text-black font-medium border-b-2 border-black pb-0.5'
                                : 'text-gray-500'
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}