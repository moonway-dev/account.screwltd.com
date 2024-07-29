"use client";
import { useAuth } from '@/contexts/AuthProvider';
import { FaDiscord, FaGithub, FaGoogle, FaTwitch } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md"
import { IoIosCloseCircle } from "react-icons/io"
import { BsThreeDots } from "react-icons/bs"
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from '@/lib/utils';

const maskEmail = (email: string) => {
  const [username, domain] = email.split('@');
  const maskedUsername = username[0] + '******';
  return `${maskedUsername}@${domain}`;
};

export default function LinksPage() {
  const { user, setNewData } = useAuth();

  const userDetails = [
    {
      condition: user?.email,
      icon: <MdAlternateEmail className='absolute size-24 opacity-10 mt-[-24px] ml-[-22px] -rotate-[25deg] pointer-events-none' />,
      label: 'E-mail',
      value: maskEmail(user?.email),
    },
    {
      condition: user?.discordId,
      id: 'discordId',
      icon: <FaDiscord className='absolute size-24 opacity-10 mt-[-24px] ml-[-22px] -rotate-[25deg] pointer-events-none' />,
      label: 'Discord',
      value: `ID: ${user?.discordId}`,
    },
    {
      condition: user?.githubId,
      id: 'githubId',
      icon: <FaGithub className='absolute size-24 opacity-10 mt-[-24px] ml-[-22px] -rotate-[25deg] pointer-events-none' />,
      label: 'Github',
      value: `ID: ${user?.githubId}`,
    },
    {
      condition: user?.googleId,
      id: 'googleId',
      icon: <FaGoogle className='absolute size-24 opacity-10 mt-[-24px] ml-[-22px] -rotate-[25deg] pointer-events-none' />,
      label: 'Google',
      value: `ID: ${user?.googleId}`,
    },
    {
      condition: user?.twitchId,
      id: 'twitchId',
      icon: <FaTwitch className='absolute size-24 opacity-10 mt-[-16px] ml-[-22px] -rotate-[25deg] pointer-events-none' />,
      label: 'Twitch',
      value: `ID: ${user?.twitchId}`,
    }
  ];

  const iconButtons = [
    { condition: !user?.discordId, icon: <FaDiscord />, id: 'discord' },
    { condition: !user?.githubId, icon: <FaGithub />, id: 'github' },
    { condition: !user?.googleId, icon: <FaGoogle />, id: 'google' },
    { condition: !user?.twitchId, icon: <FaTwitch />, id: 'twitch' },
  ];

  return (
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>SCREW: ID</p>
      </BlurFade>
      <BlurFade className="w-full" delay={0.05}>
        <div
          className={cn(
            "group relative w-full mb-4 p-2 overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <p className="text-md font-medium text-violet-300">Link other social networks</p>
          <div className="flex overflow-x-auto space-x-2 mt-2">
            {iconButtons.map((button, index) =>
              button.condition && (
                <button
                  key={index}
                  onClick={() => { window.location.href = `https://api.screwltd.com/v3/auth/other/${button.id}?redirect=account&token=${user?.jwt_token}` }}
                  className={`cursor-pointer p-2 rounded-full bg-white/10 text-white hover:bg-white/30`}
                >
                  {button.icon}
                </button>
              )
            )}
            <button
              disabled={true}
              className={`p-2 rounded-full bg-white/10 text-white hover:bg-white/30`}
            >
              <BsThreeDots />
            </button>
          </div>
        </div>
      </BlurFade>
      {userDetails.map((detail, index) =>
        detail.condition && (
          <BlurFade key={index} className="w-full" delay={parseFloat(`0.${index + 1}5`)}>
            <div className="relative w-full h-full">
              <div
                className={cn(
                  "group relative w-full mb-4 p-2 overflow-hidden rounded-xl",
                  "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                  "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                )}
              >
                {detail.icon}
                <p className="text-md font-medium text-violet-300">{detail.label}</p>
                <p className="text-sm font-light">{detail.value}</p>
              </div>
              {detail.label !== 'E-mail' && (
                <button type='button' onClick={() => setNewData(detail.id as string, '')} className='absolute transition-all -top-2 -right-2 hover:-right-3 hover:-top-3 active:-right-2 active:-top-2'><IoIosCloseCircle className='transition-all size-6 text-violet-300 hover:size-8 active:size-6' /></button>
              )}
            </div>
          </BlurFade>
        )
      )}
    </main>
  );
}
