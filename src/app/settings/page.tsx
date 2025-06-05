"use client";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Switch, Stack, Input, Button, Typography, Divider, Snackbar } from "@mui/joy";
import { KeyRound, User } from "lucide-react";
import { useAuth, updatePassword } from '@/contexts/AuthProvider';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdAlternateEmail } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

type SnackbarColor = 'neutral' | 'danger';
const initialSnackbarColor: SnackbarColor = 'neutral';

function useTranslation() {
  const { language } = useLanguage();
  return language === 'ru' ? ru : en;
}

export default function SettingsPage() {
  const { user, setNewData } = useAuth();
  const router = useRouter();
  const t = useTranslation();

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
      setSnackbarText(t.settings.snackbar.username_short);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (username === user?.username) {
      setSnackbarText(t.settings.snackbar.username_same);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    try {
      await setNewData('username', username);
      setSnackbarText(t.settings.snackbar.username_updated);
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : t.settings.snackbar.error);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<User size={16}/>);
      setOpenSnackbar(true);
    }
  };

  const handleUserTagSubmit = async () => {
    if (userTag.length < 4) {
      setSnackbarText(t.settings.snackbar.tag_short);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (!/^[a-zA-Z0-9\-_]+$/.test(userTag)) {
      setSnackbarText(t.settings.snackbar.tag_invalid);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    if (userTag === user?.usertag) {
      setSnackbarText(t.settings.snackbar.tag_same);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
      return;
    }

    try {
      await setNewData('usertag', userTag);
      setSnackbarText(t.settings.snackbar.tag_updated);
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : t.settings.snackbar.error);
      setSnackbarColor("danger" as SnackbarColor);
      setSnackbarIcon(<MdAlternateEmail size={16}/>);
      setOpenSnackbar(true);
    }
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (password.length < 6) {
      setSnackbarText(t.settings.snackbar.password_short);
      setSnackbarColor("danger");
      setSnackbarIcon(<KeyRound />);
      setOpenSnackbar(true);
      return;
    }

    try {
      await updatePassword(password, user?.jwt_token);
      setSnackbarText(t.settings.snackbar.password_updated);
      setSnackbarColor("neutral" as SnackbarColor);
      setSnackbarIcon(<KeyRound />);
      setOpenSnackbar(true);
    } catch (err: unknown) {
      console.log(err);
      setSnackbarText(err instanceof Error ? err.message : t.settings.snackbar.error);
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
        <p className='font-medium text-xl mb-4 mt-[-40px]'>{t.settings.title}</p>
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
            <Typography level="title-lg">{t.settings.account}</Typography>
            <Stack spacing={1}>
              <Typography level="title-sm">{t.settings.username}</Typography>
              <Stack direction='row' spacing={1}>
                <Input 
                  value={username} 
                  onChange={handleUsernameChange} 
                  sx={{ width: '100%', borderRadius: '25px' }} 
                  placeholder={t.settings.username} 
                />
                <Button onClick={handleUsernameSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>{t.settings.save}</Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography level="title-sm">{t.settings.tag}</Typography>
              <Stack direction='row' spacing={1}>
                <Input 
                  value={userTag}
                  onChange={handleUserTagChange}
                  sx={{ width: '100%', borderRadius: '25px' }}
                  startDecorator={<MdAlternateEmail />}
                  placeholder={t.settings.tag}
                />
                <Button onClick={handleUserTagSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>{t.settings.save}</Button>
              </Stack>
            </Stack>
            <Stack spacing={1}>
              <Typography level="title-sm">{t.settings.password}</Typography>
              <Stack direction='row' spacing={1}>
                <Input value={password} onChange={handlePasswordChange} sx={{ width: '100%',  borderRadius: '25px' }} type="password" startDecorator={<KeyRound className="size-4" />} placeholder={t.settings.password} />
                <Button onClick={handlePasswordSubmit} sx={{ marginY: 0.05, borderRadius: 250 }}>{t.settings.save}</Button>
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
            <Typography level="title-lg">{t.settings.location}</Typography>
            <Stack direction='row' spacing={1}>
              <Typography sx={{ width: '100%' }}>{t.settings.current_country}: <b>{user?.country}</b></Typography>
              <Button onClick={() => router.push('/wizard/region')} sx={{ borderRadius: 250 }}>{t.settings.change}</Button>
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
            <Typography level="title-lg">{t.settings.collect_info}</Typography>
            <Stack direction='row' spacing={1}>
              <Typography sx={{ width: '100%' }}>{t.settings.save_attributes}</Typography>
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
