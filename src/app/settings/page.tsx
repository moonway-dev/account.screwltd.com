"use client";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Switch, Stack, Input, Button, Typography, Divider, Snackbar } from "@mui/joy";
import { KeyRound, User } from "lucide-react";
import { useAuth, updatePassword } from '@/contexts/AuthProvider';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAlternateEmail } from "react-icons/md";

type SnackbarColor = 'neutral' | 'danger';
const initialSnackbarColor: SnackbarColor = 'neutral';

export default function SettingsPage() {
  const { user, setNewData } = useAuth();
  const router = useRouter();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState<SnackbarColor>(initialSnackbarColor);
  const [snackbarText, setSnackbarText] = useState('Your password successfuly changed.');
  const [snackbarIcon, setSnackbarIcon] = useState(<KeyRound />);
  const [checked, setChecked] = useState(user == null ? true : user.collectData);

  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(user?.username || '');
  const [userTag, setUserTag] = useState(user?.usertag || '');

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleUsernameChange = (e: any) => {
    setUsername(e.target.value);
  };

  const handleUserTagChange = (e: any) => {
    let value = e.target.value;
    if (value.startsWith('@')) {
      value = value.substring(1);
    }
    value = value.replace(/[^a-zA-Z0-9\-_]/g, '');
    setUserTag(value);
  };

  const handleUsernameSubmit = async () => {
    if (username.length < 4) {
      setSnackbarText('Username must be at least 4 characters long.');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (username === user?.username) {
      setSnackbarText('Username is the same as current.');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    try {
      await setNewData('username', username);
      setSnackbarText('Username successfully updated.');
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
    }
  };

  const handleUserTagSubmit = async () => {
    if (userTag.length < 4) {
      setSnackbarText('Tag must be at least 4 characters long.');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (!/^[a-zA-Z0-9\-_]+$/.test(userTag)) {
      setSnackbarText('Tag can only contain English letters, numbers, - and _ symbols.');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (userTag === user?.usertag) {
      setSnackbarText('Tag is the same as current.');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    try {
      await setNewData('usertag', userTag);
      setSnackbarText('Tag successfully updated.');
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (password.length < 6) {
      setSnackbarText('The password must be at least 6 characters long.');
      setSnackbarColor("danger");
      setSnackbarIcon(<KeyRound />);
      setOpenSnackbar(true);
      return;
    }

    try {
      await updatePassword(password, user?.jwt_token);
      setSnackbarText('Your password successfuly changed.');
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<KeyRound />);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : 'An unexpected error occurred');
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<KeyRound />);
      setOpenSnackbar(true);
    } finally {
      setPassword('');
    }
  };

  const handleSwitch = (event: any) => { 
    setChecked(event.target.checked);
    setNewData('collectData', event.target.checked);
  };

  return (<>
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>SCREW: ID</p>
      </BlurFade>
      <BlurFade className="w-full mb-2" delay={0.15}>
        <div
          className={cn(
            "group relative w-full p-4 mb-4overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <Stack spacing={1}>
            <Typography level="title-lg">Account</Typography>
            <Stack spacing={1}>
              <Typography level="title-sm">Username</Typography>
              <Stack direction='row' spacing={1}>
                <Input 
                  value={username} 
                  onChange={handleUsernameChange} 
                  sx={{ width: '100%', borderRadius: '25px' }} 
                  placeholder="Enter new username..." 
                />
                <Button onClick={handleUsernameSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>Save</Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography level="title-sm">Tag</Typography>
              <Stack direction='row' spacing={1}>
                <Input 
                  value={userTag}
                  onChange={handleUserTagChange}
                  sx={{ width: '100%', borderRadius: '25px' }}
                  startDecorator={<MdAlternateEmail />}
                  placeholder="Enter user tag..."
                />
                <Button onClick={handleUserTagSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>Save</Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography level="title-sm">Password</Typography>
              <Stack direction='row' spacing={1}>
                <Input value={password} onChange={handlePasswordChange} sx={{ width: '100%',  borderRadius: '25px' }} type="password" startDecorator={<KeyRound className="size-4" />} placeholder="Enter new password..." />
                <Button onClick={handlePasswordSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>Save</Button>
              </Stack>
            </Stack>
          </Stack>
        </div>
      </BlurFade>
      <BlurFade className="w-full mb-2" delay={0.25}>
        <div
          className={cn(
            "group relative w-full p-4 mb-4overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <Stack spacing={1}>
            <Typography level="title-lg">Location</Typography>
            <Stack direction='row' spacing={1}>
              <Typography sx={{ width: '100%' }}>Current country: <b>{user?.country}</b></Typography>
              <Button onClick={() => router.push('/wizard/region')} sx={{ borderRadius: 250 }}>Change</Button>
            </Stack>
          </Stack>
        </div>
      </BlurFade>
      <BlurFade className="w-full mb-2" delay={0.35}>
        <div
          className={cn(
            "group relative w-full p-4 mb-4overflow-hidden rounded-xl",
            "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            "transform-gpu dark:bg-black dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
          )}
        >
          <Stack spacing={1}>
            <Typography level="title-lg">Collection of information</Typography>
            <Stack direction='row' spacing={1}>
              <Typography sx={{ width: '100%' }}>Save sent attributes</Typography>
              <Switch checked={checked} onChange={handleSwitch}/>
            </Stack>
          </Stack>
        </div>
      </BlurFade>
    </main>
    <Snackbar
      variant="soft"
      color={snackbarColor}
      autoHideDuration={5000}
      open={openSnackbar}
      onClose={() => setOpenSnackbar(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      startDecorator={snackbarIcon}
    >
      {snackbarText}
    </Snackbar>
  </>
  );
}
