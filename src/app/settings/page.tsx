"use client";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Switch, Stack, Input, Button, Typography, Divider, Snackbar } from "@mui/joy";
import { KeyRound } from "lucide-react";
import { useAuth, updatePassword } from '@/contexts/AuthProvider';
import { useState } from "react";

export default function LinksPage() {
  const { user } = useAuth();
  
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarColor, setSnackbarColor] = useState("neutral");
  const [snackbarText, setSnackbarText] = useState('Your password successfuly changed.');

  const [password, setPassword] = useState('');
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    if (password.length < 6) {
      setSnackbarText('The password must be at least 6 characters long.');
      setSnackbarColor("danger");
      setOpenSnackbar(true);
      return;
    }

    try {
      await updatePassword(password, user.jwt_token);
      setSnackbarText('Your password successfuly changed.');
      setSnackbarColor("neutral");
      setOpenSnackbar(true);
    } catch (err) {
      console.log(err);
      setSnackbarText('An unexpected error occurred.');
      setSnackbarColor("danger");
      setOpenSnackbar(true);
    } finally {
      setPassword('');
    }
  };

  return (<>
    <main className="flex flex-col items-center min-h-[100dvh] p-6">
      <BlurFade delay={0.05}>
        <p className='font-medium text-xl mb-4 mt-[-40px]'>SCREW: ID</p>
      </BlurFade>
      <BlurFade className="w-full" delay={0.15}>
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
              <Typography level="title-sm">Password</Typography>
              <Stack direction='row' spacing={1}>
                <Input value={password} onChange={handlePasswordChange} sx={{ width: '100%',  borderRadius: '10px' }} type="password" startDecorator={<KeyRound className="size-4" />} placeholder="Enter new password..." />
                <Button onClick={handlePasswordSubmit} sx={{ marginY: 0.05, borderRadius: '10px' }}>Save</Button>
              </Stack>
            </Stack>
            <div className="py-2">
              <Divider />
            </div>
            <Typography level="title-lg">Collection of information</Typography>

            <Stack direction='row' spacing={1}>
              <Typography sx={{ width: '100%' }}>Save sent attributes</Typography>
              <Switch disabled checked />
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
      startDecorator={<KeyRound />}
    >
      {snackbarText}

    </Snackbar>
  </>
  );
}
