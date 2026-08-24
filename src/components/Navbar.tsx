import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Heart, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';
import { logoutApi } from '@/api/auth.api';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Navbar() {
    const { user, logout, isAuth } = useAuthStore();
    const navigate                 = useNavigate();
    const [search, setSearch]      = useState('');

    const handleLogout = async () => {
        try {
            await logoutApi();
        } catch (err) { void err; }
        logout();
        navigate('/login');
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            navigate(`/?search=${search}`);
        }
    };

    const isSeller = user?.roles.some((r: { name: string }) => r.name === 'seller');

    return (
        <nav className="border-b border-gray-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
                {/* Logo */}
                <Link to="/" className="text-xl font-bold shrink-0">
                    AgoraNet
                </Link>

                {/* Search */}
                <div className="relative flex-1 max-w-xl mx-auto">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        className="w-full bg-gray-100 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                </div>

                {/* Right side */}
                <div className="flex items-center gap-4 ml-auto">
                    {isAuth() ? (
                        <>
                            <Link to="/wishlist" className="flex items-center gap-1 text-sm hover:underline">
                                <Heart size={16} />
                                Wishlist
                            </Link>
                            {isSeller && (
                                <Link to="/dashboard/products/new">
                                    <Button size="sm">Sell Now</Button>
                                </Link>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <button className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 overflow-hidden">
                                            {user?.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt={user.username}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span>{user?.firstname?.[0]}{user?.lastname?.[0]}</span>
                                            )}
                                        </div>
                                        <ChevronDown size={14} className="text-gray-500" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onClick={() => navigate(`/profile/${user?.username}`)}>
                                        Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate('/orders/my')}>
                                        My Orders
                                    </DropdownMenuItem>
                                    {isSeller && (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                                                My Products
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate('/dashboard/orders')}>
                                                Incoming Orders
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    {!isSeller && (
                                        <DropdownMenuItem onClick={() => navigate('/become-seller')}>
                                            Become a Seller
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate(`/profile/${user?.username}/edit`)}>
                                        Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm hover:underline">
                                Login
                            </Link>
                            <Link to="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}