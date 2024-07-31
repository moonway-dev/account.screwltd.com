"use client";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";
import { useAuth, updatePassword } from '@/contexts/AuthProvider';
import { useState } from "react";

const formatDate = (dateTimeString: string): string => {
  const datePart = dateTimeString.split('T')[0];
  const [year, month, day] = datePart.split('-');
  const formattedDate = `${year}.${month}.${day}`;
  return formattedDate;
}

export default function NotificationsPage() {
  const { user } = useAuth();

  if(!user)
    return (<div/>);

  return (<>
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>SCREW: ID</p>
      </BlurFade>
      <BlurFade className="w-full" delay={0.15}>
        <figure
          className={cn(
            "relative mx-auto min-h-fit w-full cursor-pointer overflow-hidden rounded-2xl p-4",
            "transition-all duration-200 ease-in-out hover:scale-[98%]",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <div className="flex flex-row items-center gap-3">
            <div
              className="flex size-10 items-center justify-center rounded-2xl aspect-square min-h-[40px] min-w-[40px]"
              style={{
                backgroundColor: '#FF3D71',
              }}
            >
              <span className="text-lg">⚙</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
                <span className="text-sm sm:text-lg">Hello, {user?.username}</span>
                <span className="mx-1">·</span>
                <span className="text-xs text-gray-500">{formatDate(user?.created_at)}</span>
              </figcaption>
              <p className="text-sm font-normal dark:text-white/60">
                You have successfully registered with SCREW: ID.
              </p>
            </div>
          </div>
        </figure>
      </BlurFade>
    </main>
  </>
  );
}
