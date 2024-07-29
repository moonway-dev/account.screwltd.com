'use client';

import React, { useState, useEffect, useContext, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import GridPattern from '@/components/magicui/grid-pattern';
import { cn } from '@/lib/utils';
import RingLoader from 'react-spinners/RingLoader';

interface AuthContextType {
    user: Record<string, any> | null;
    loading: boolean;
    setNewData: (row: string, data: string) => Promise<void>;
    fetchUserKeys: (token: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const searchParams = useSearchParams();

    useEffect(() => {
        const checkToken = async () => {
            const tokenFromUrl = searchParams.get('token');

            if (!user) {
                if (tokenFromUrl && tokenFromUrl !== '') {
                    localStorage.setItem('screwltd-token', tokenFromUrl);
                    await fetchUserProfile(tokenFromUrl);
                } else {
                    const token = localStorage.getItem('screwltd-token');
                    if (token) {
                        await fetchUserProfile(token);
                    } else {
                        setLoading(false);
                        localStorage.removeItem('screwltd-token');
                        redirectToAuth();
                    }
                }
            }
        };

        checkToken();
    }, [searchParams]);

    const setNewData = async (row: string, data: string) => {
        const editResponse = await fetch('https://api.screwltd.com/v3/auth/update/me', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.jwt_token}`,
            },
            body: JSON.stringify({ [row]: data }),
        });

        if (!editResponse.ok) {
            throw new Error(`Edit failed: ${editResponse.statusText}`);
        }

        setUser(prevUser => ({
            ...prevUser,
            [row]: data,
        }));
    };

    const fetchUserKeys = async (token: string) => {
        try {
            setUser(prevUser => ({
                ...prevUser,
                keys: null, 
            }));

            const response = await fetch('https://api.screwltd.com/v3/keys/get', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch keys');
            }
            const keys = await response.json();
            setUser(prevUser => ({
                ...prevUser,
                keys,
            }));
        } catch (error) {
            console.error('Error fetching keys:', error);
        }
    };

    const fetchUserProfile = async (token: string) => {
        try {
            const response = await fetch('https://api.screwltd.com/v3/auth/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Token validation failed');
            }
            const data = await response.json();
            data.jwt_token = token;
            setUser(data);
            await fetchUserKeys(token);
            setLoading(false);
        } catch {
            setLoading(false);
            localStorage.removeItem('screwltd-token');
            redirectToAuth();
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, setNewData, fetchUserKeys}}>
            {loading ? (
                <>
                    <GridPattern
                        width={30}
                        height={30}
                        x={-1}
                        y={-1}
                        strokeDasharray={"4 2"}
                        className={cn(
                            "fixed opacity-50 [mask-image:radial-gradient(1000px_circle_at_center,white,transparent)] inset-y-[-30%] h-[150dvh] skew-y-12",
                        )}
                    />
                    <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center fixed inset-0 m-auto">
                        <RingLoader color="violet" size={35} />
                    </div>
                </>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const redirectToAuth = () => {
    if (typeof window !== 'undefined') {
        window.location.href = `https://auth.screwltd.com/?redirect=account`;
    }
};

export const logout = () => {
    localStorage.removeItem('screwltd-token');
    redirectToAuth();
};

export default AuthProvider;

export async function updatePassword(password: string, token: string) {
    try {
        const response = await fetch('https://api.screwltd.com/v3/auth/update/password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to update password');
        }

        return data.message;
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}
