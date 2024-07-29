"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Select, Tooltip, Option, Stack, Button, Typography } from '@mui/joy';
import { useAuth } from '@/contexts/AuthProvider';
import { KeyRound } from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import { useState } from "react";

export default function LinksPage() {
  const { user, setNewData, fetchUserKeys } = useAuth();

  const [selectedApiType, setSelectedApiType] = useState('');
  const handleChangeApiType = (event: any, newValue: any) => {
    setSelectedApiType(newValue);
  };

  const createKey = async () => {
    if(selectedApiType == '' || selectedApiType == null)
      return;

    const apiUrl = 'https://api.screwltd.com/v3/keys/create';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.jwt_token}`
      },
      body: JSON.stringify({ type: selectedApiType })
    });

    if (!response.ok) {
      const error = await response.text();
      console.log(`Error: ${response.status} - ${error}`);
      return;
    }

    const data = await response.json();
    fetchUserKeys(user?.jwt_token);
    return data;
  };

  return (
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>SCREW: ID</p>
      </BlurFade>
      <BlurFade delay={0.05} className="w-full">
        <div
          className={cn(
            "group relative w-full mb-4 p-6 overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <Typography level="title-md" sx={{ mb: 1 }}>Create new API key</Typography>
          <Stack direction='row'>
            <Select value={selectedApiType} onChange={handleChangeApiType} sx={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.08)' } }} placeholder="Choose one…" variant="plain">
              <Option value="AI">AI</Option>
              <Option disabled value="CLOUD">Cloud</Option>
              <Option value="PAYMENT">Payment</Option>
            </Select>
            <Button onClick={() => createKey()} sx={{ ml: 1, marginY: 0.05, borderRadius: '10px' }}>Create</Button>
          </Stack>
        </div>
      </BlurFade>
      {user?.keys?.map((key, index) => (
        <BlurFade key={index} delay={parseFloat(`0.${index + 1}5`)} className="w-full">
          <div
            className={cn(
              "group relative w-full mb-4 p-6 overflow-hidden rounded-xl",
              "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
              "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
              "flex items-center justify-between"
            )}
          >
            <KeyRound className='absolute size-24 opacity-10 ml-[-36px] -rotate-[90deg] pointer-events-none' />
            <Tooltip title="Type" variant="soft" placement="top">
              <Typography sx={{ width: '20%', textAlign: 'left' }} level="title-md">{key.type}</Typography>
            </Tooltip>
            <Tooltip title="Key" variant="soft" placement="top">
              <Typography noWrap sx={{ ml: 4, mr: 4 }}>
                {key.key}
              </Typography>
            </Tooltip>
            <Tooltip title="Usages" variant="soft" placement="top">
              <Typography sx={{ width: '20%', textAlign: 'right' }} level="title-md">
                {key.usages != 0 ? (
                  <NumberTicker value={key.usages} />
                ) : (
                  <p>0</p>
                )}
              </Typography>
            </Tooltip>
          </div>
        </BlurFade>
      ))}
    </main>
  );
}
