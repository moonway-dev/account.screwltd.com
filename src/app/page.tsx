"use client";
import BlurFade from '@/components/magicui/blur-fade';
import { BentoDemo } from '@/components/profileGrid';
import { cn } from '@/lib/utils';
import { FaPen } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthProvider';
import { useRef, useState } from 'react';
import RingLoader from 'react-spinners/RingLoader';
import { Typography, useTheme } from '@mui/joy';
import { useMedia } from 'react-use'
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

function useTranslation() {
  const { language } = useLanguage();
  return language === 'ru' ? ru : en;
}

export default function Profile() {
  const { user, setNewData } = useAuth();
  const theme = useTheme()
  const isMobile = useMedia(`(max-width: ${theme.breakpoints.values.sm}px)`)
  const t = useTranslation();

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };


  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (file: any) => {
    setLoadingImg(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('https://api.screwltd.com/v3/cloud/storage/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.jwt_token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.statusText}`);
      }
      const uploadData = await uploadResponse.json();
      const avatarUrl = `https://api.screwltd.com/v3/cloud/storage/get/${uploadData.data.fileName}`;

      setNewData('avatar', avatarUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      if (username.length > 0) {
        setNewData('username', username);
        setIsEditing(false);
      }
    }
  };

  const [loadingImg, setLoadingImg] = useState(true);

  return (
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>{t.settings.title}</p>
      </BlurFade>
      <BlurFade className='w-full' delay={0.15}>
        <div
          className={cn(
            "group relative w-full mb-4 p-6 flex flex-col items-center col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <div onClick={triggerFileSelect} className="relative w-[100px] h-[100px] inline-block cursor-pointer">
            {loadingImg && (
              <div className="w-[100px] h-[100px] rounded-full absolute inset-0 bg-black flex items-center justify-center">
                <RingLoader color="violet" loading={loadingImg} size={35} />
              </div>
            )}

            <img
              src={user?.avatar || ''}
              alt={`${user?.username}'s avatar`}
              width={100}
              height={100}
              onLoad={() => setLoadingImg(false)}
              onError={() => setLoadingImg(false)}
              className="w-[100px] h-[100px] max-w-[100px] max-h-[100px] object-cover mb-2 rounded-full transition-transform duration-300 ease-in-out"
            />

            <div className="w-[100px] h-[100px] absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-full">
              <FaPen className="text-white text-2xl" />
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <p className='font-normal text-lg'>
              {username}
            </p>
          </div>
          <p className='font-light text-xs'>@{user?.usertag}</p>
        </div>
      </BlurFade>

      <BlurFade delay={0.35}>
        <BentoDemo />
      </BlurFade>
      <BlurFade delay={0.35}>
        <Typography level='body-xs' sx={{ mt: 2, mb: isMobile ? 2 : -4, textAlign: 'center' }}>{t.profile.notice}</Typography>
      </BlurFade>
    </main >
  );
}
