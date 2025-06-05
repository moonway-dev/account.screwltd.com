'use client';

import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/joy';
import BlurFade from '@/components/magicui/blur-fade';
import { cn } from '@/lib/utils';
import { useMedia } from 'react-use';
import { useTheme } from '@mui/joy/styles';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthProvider';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

interface IPResponse {
    country: string;
    currency_code: string;
    state: string;
    city: string;
}

function useTranslation() {
    const { language } = useLanguage();
    return language === 'ru' ? ru : en;
}

export default function ChangeCountryPage() {
    const router = useRouter();
    const isMobile = useMedia(`(max-width: ${useTheme().breakpoints.values.md}px)`);
    const { user, setNewData, updateCountry } = useAuth();
    const [userLocation, setUserLocation] = useState<IPResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [apiMessage, setApiMessage] = useState<string | null>(null);
    const t = useTranslation();

    useEffect(() => {
        const fetchUserLocation = async () => {
            try {
                const response = await fetch('https://api.ipapi.is/?');
                const data = await response.json();
                setUserLocation(data.location);
            } catch (error) {
                console.error('Error fetching user location:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserLocation();
    }, []);

    const handleCancel = () => {
        router.push('/settings');
    };

    const handleChangeCountry = async () => {
        if (!userLocation?.country) return;

        try {
            setUpdating(true);
            setApiMessage(null);
            const response = await fetch('https://api.screwltd.com/v3/auth/update/country', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user?.jwt_token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update country');
            }

            setApiMessage(data.message || 'Country updated successfully');

            // Update local user data
            updateCountry(userLocation.country);

            router.push('/settings');
        } catch (error: any) {
            console.error('Error updating country:', error);
            setApiMessage(error.message || 'Failed to update country');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <main className="flex flex-col items-center p-6">
            <div className="w-full max-w-3xl">
                <BlurFade delay={0.05}>
                    <div className="flex items-center w-full mb-8">
                        <Button
                            onClick={handleCancel}
                            variant="plain"
                            color="neutral"
                            startDecorator={<ArrowLeft size={20} />}
                            sx={{
                                borderRadius: '20px',
                                mr: 2,
                                color: 'white',
                            }}
                        >
                            {t.region.back}
                        </Button>
                        <Typography level="h4" fontWeight="bold" sx={{ color: 'white' }}>
                            {t.region.change_country}
                        </Typography>
                    </div>
                </BlurFade>

                <BlurFade className="w-full" delay={0.15}>
                    <div
                        className={cn(
                            "w-full p-6 rounded-[20px]",
                            "bg-black/40 backdrop-blur-sm [box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(0,0,0,.2),0_12px_24px_rgba(0,0,0,.2)]",
                            "transform-gpu dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                        )}
                    >
                        <div className="space-y-6">
                            <div>
                                <Typography level="body-md" mb={2} sx={{ color: 'white' }}>
                                    {loading ? (
                                        t.region.loading
                                    ) : (
                                        <>
                                            {t.region.contact_from} <b>{userLocation?.country || t.region.unknown}</b> {t.region.and_registered} <b>{user?.country}</b>.<br />{userLocation?.country === user?.country ? t.region.already_set : t.region.continue}
                                        </>
                                    )}
                                </Typography>
                            </div>

                            {apiMessage && (
                                <BlurFade delay={0.05}>
                                    <div className={cn(
                                        "p-4 rounded-[20px]",
                                        apiMessage.includes('success') ? "bg-green-500/20" : "bg-red-500/20"
                                    )}>
                                        <Typography level="body-sm" sx={{ color: 'white' }}>
                                            {apiMessage}
                                        </Typography>
                                    </div>
                                </BlurFade>
                            )}

                            <div className="pt-4">
                                <Button
                                    onClick={handleChangeCountry}
                                    size="md"
                                    color="primary"
                                    className="w-full rounded-[20px]"
                                    sx={{
                                        borderRadius: '20px',
                                        backgroundColor: '#4a1680',
                                        '&:hover': {
                                            backgroundColor: '#7b1fa2',
                                        }
                                    }}
                                    loading={updating}
                                    disabled={loading || updating || !userLocation?.country || userLocation?.country === user?.country}
                                >
                                    {userLocation?.country === user?.country ? t.region.no_changes : t.region.change_country}
                                </Button>
                            </div>
                        </div>
                    </div>
                </BlurFade>
            </div>
        </main>
    );
}
