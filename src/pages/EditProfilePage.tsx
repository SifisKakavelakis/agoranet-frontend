import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { updateUserApi } from '@/api/user.api';
import { getMeApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditProfilePage() {
    const { username }                      = useParams();
    const navigate                          = useNavigate();
    const [searchParams]                    = useSearchParams();
    const { user, setAuth, token }          = useAuthStore();
    const [firstname, setFirstname]         = useState(user?.firstname || '');
    const [lastname, setLastname]           = useState(user?.lastname || '');
    const [email, setEmail]                 = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber]     = useState(user?.phoneNumber || '');
    const [avatarUrl, setAvatarUrl]         = useState(user?.avatarUrl || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword]           = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading]             = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await updateUserApi(username!, {
                firstname,
                lastname,
                email,
                ...(phoneNumber && { phoneNumber }),
                ...(avatarUrl && { avatarUrl }),
                ...(password && { password, currentPassword }),
            });

            const result = await getMeApi();
            setAuth(result.data, token!);
            toast.success('Profile updated successfully');

            const redirect = searchParams.get('redirect');
            navigate(redirect || `/profile/${username}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold mb-2">Edit Profile</h1>
            <p className="text-gray-500 text-sm mb-8">Update your personal information</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Top section — Avatar + Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left — Avatar */}
                    <div className="border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Profile Picture</h2>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.firstname?.[0]}{user?.lastname?.[0]}</span>
                                )}
                            </div>
                            <div className="w-full flex flex-col gap-1">
                                <Label htmlFor="avatarUrl">Avatar URL</Label>
                                <Input
                                    id="avatarUrl"
                                    type="url"
                                    placeholder="https://example.com/avatar.jpg"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right — Personal Info */}
                    <div className="border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Personal Information</h2>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input
                                id="firstname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input
                                id="lastname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="6912345678"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="border border-gray-200 rounded-lg p-6 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Security</h2>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => navigate(`/profile/${username}`)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}