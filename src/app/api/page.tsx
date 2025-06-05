"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Select, Tooltip, Option, Stack, Button, Typography, Input, Textarea, Modal, ModalDialog, ModalClose, FormControl, FormLabel, IconButton, Box, useTheme, CircularProgress, Switch, Tabs, TabList, Tab, TabPanel, Link } from '@mui/joy';
import { useAuth } from '../../contexts/AuthProvider';
import { KeyRound, Plus, X, Copy, Check } from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Transition } from 'react-transition-group';
import { useMedia } from "react-use";
import axios from 'axios';
import { MdDataUsage } from "react-icons/md";
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

interface Application {
  id: string;
  key: string;
  usages: number;
  name: string;
  avatar: string;
  description: string | null;
  oauth?: {
    enabled: boolean;
    redirectUri?: string;
    scopes?: string[];
  };
}

const transitionStyles = {
  entering: { opacity: 0, transform: 'scale(0.95)', backdropFilter: 'blur(0px)' },
  entered: { opacity: 1, transform: 'scale(1)', backdropFilter: 'blur(8px)' },
  exiting: { opacity: 0, transform: 'scale(0.95)', backdropFilter: 'blur(0px)' },
  exited: { opacity: 0, transform: 'scale(0.95)', backdropFilter: 'blur(0px)' },
  unmounted: { opacity: 0, transform: 'scale(0.95)', backdropFilter: 'blur(0px)' }
} as const;

function useTranslation() {
  const { language } = useLanguage();
  return language === 'ru' ? ru : en;
}

export default function ApiPage() {
  const { user } = useAuth();
  const isMobile = useMedia(`(max-width: ${useTheme().breakpoints.values.md}px)`)
  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [newApp, setNewApp] = useState<Partial<Application>>({
    name: 'Application',
    avatar: 'https://placehold.co/256x256',
    description: null,
    oauth: {
      enabled: false,
      redirectUri: '',
      scopes: []
    }
  });
  const t = useTranslation();

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const transformedApps = user?.keys.map((app: any) => ({
        key: app.key,
        id: app.id,
        usages: app.usages || 0,
        name: app.name,
        avatar: app.avatar || 'https://placehold.co/256x256',
        description: app.description
      }));

      const sortedApps = transformedApps.sort((a: Application, b: Application) =>
        a.name.localeCompare(b.name)
      );

      setApplications(sortedApps);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleCreateApp = async () => {
    try {
      setError(null);
      const response = await axios.post('https://api.screwltd.com/v3/keys/create',
        {
          name: newApp.name,
          description: newApp.description,
          oauth: newApp.oauth
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.jwt_token}`,
          },
        }
      );

      // Add the new application to the list
      const newApplication: Application = {
        id: response.data.id,
        key: response.data.key,
        usages: 0,
        name: newApp.name || 'Application',
        avatar: newApp.avatar || 'https://placehold.co/256x256',
        description: newApp.description || null,
        oauth: newApp.oauth
      };

      setApplications([...applications, newApplication]);
      setOpen(false);
      setNewApp({
        name: 'Application',
        avatar: 'https://placehold.co/256x256',
        description: null,
        oauth: {
          enabled: false,
          redirectUri: '',
          scopes: []
        }
      });
    } catch (err) {
      console.error('Error creating application:', err);
      setError('Failed to create application');
    }
  };

  const updateApplication = async (key: string, updates: { name?: string; description?: string | null }) => {
    try {
      const response = await axios.put(
        `https://api.screwltd.com/v3/keys/update/${key}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${user?.jwt_token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error updating application:', err);
      throw err;
    }
  };

  const handleUpdateApp = (updatedApp: Application): void => {
    setEditingApp({
      ...updatedApp,
      description: updatedApp.description === '' ? null : updatedApp.description,
      oauth: {
        enabled: updatedApp.oauth?.enabled || false,
        redirectUri: updatedApp.oauth?.redirectUri || '',
        scopes: updatedApp.oauth?.scopes || []
      }
    });
  };

  const handleSaveApp = async () => {
    if (editingApp) {
      try {
        setSaving(true);
        setError(null);

        const updates = {
          name: editingApp.name,
          description: editingApp.description,
          oauth: editingApp.oauth
        };

        await updateApplication(editingApp.key, updates);

        setApplications(applications.map(app =>
          app.key === editingApp.key ? editingApp : app
        ));
        setSelectedApp(null);
        setEditingApp(null);
      } catch (err: any) {
        console.error('Error saving application:', err);
        setError(err.response?.data?.error || 'Failed to update application');
      } finally {
        setSaving(false);
      }
    }
  };

  const getOAuthBaseUrl = () => {
    if (typeof window !== 'undefined' && window.location.hostname.includes('acceptancegroup.net')) {
      return 'https://auth.acceptancegroup.net';
    }
    return 'https://auth.screwltd.com';
  };

  return (
    <main className="flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        <BlurFade delay={0.05}>
          <div className="flex justify-between items-center w-full mb-8">
            <div>
              <p className={isMobile ? 'font-medium text-lg mb-1' : 'font-medium text-2xl mb-1'}>{t.api.title}</p>
              <p className="text-gray-500 dark:text-gray-400">{isMobile ? t.api.manage_short : t.api.manage_full}</p>
            </div>
            <Button
              startDecorator={<Plus />}
              onClick={() => setOpen(true)}
              variant="solid"
              color="neutral"
              sx={{ borderRadius: '20px', bgcolor: '#8B5CF6', '&:hover': { bgcolor: '#7C3AED' } }}
            >
              {t.api.create} {!isMobile && t.api.application}
            </Button>
          </div>
        </BlurFade>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 pb-8">
            {applications.map((app, index) => (
              <BlurFade key={index} delay={parseFloat(`0.${index + 1}5`)}>
                <div
                  onClick={() => {
                    setSelectedApp(app);
                    setEditingApp(app);
                  }}
                  className={cn(
                    "group relative overflow-hidden rounded-[20px] cursor-pointer transition-all duration-200",
                    "bg-white hover:bg-purple-50/20 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                    "transform-gpu dark:bg-black dark:hover:bg-purple-950/20 dark:[border:1px_solid_rgba(147,112,219,.2)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                    "flex flex-col items-center justify-center gap-3 p-4 min-h-[200px]"
                  )}
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                    <img
                      src={app.avatar}
                      alt={app.name}
                      className="rounded-[20px] object-cover transition-transform duration-200 group-hover:scale-90 w-full h-full"
                    />
                    <div className="absolute inset-0 rounded-[20px] bg-black/40 group-hover:bg-black/20 transition-colors duration-200" />
                  </div>
                  <div className="text-center w-full">
                    <Typography level="title-sm" className="font-medium truncate">{app.name}</Typography>
                    {app.description ? (
                      <Typography level="body-xs" className="text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 px-2">
                        {app.description.slice(0, 18)}{app.description.length > 18 && '...'}
                      </Typography>
                    ) : (
                      <Typography level="body-xs" className="text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5 px-2">
                        No information...
                      </Typography>
                    )}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <BlurFade delay={0.25}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-[20px] bg-purple-50/20 dark:bg-purple-950/20 flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <Stack spacing={0} className="my-2">
                <Typography level="h4" className="mb-2">No Applications Yet</Typography>
                <Typography level="body-md" className="text-gray-500 dark:text-gray-400 mb-4">
                  Create your first application to get started
                </Typography>
              </Stack>
              <Button
                startDecorator={<Plus />}
                onClick={() => setOpen(true)}
                variant="solid"
                color="neutral"
                sx={{ borderRadius: '20px', bgcolor: '#8B5CF6', '&:hover': { bgcolor: '#7C3AED' } }}
              >
                Create Application
              </Button>
            </div>
          </BlurFade>
        )}
      </div>

      <Transition in={open} timeout={200}>
        {(state) => (
          <Modal
            open={state !== 'exited'}
            onClose={() => setOpen(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiModal-backdrop': {
                transition: 'all 200ms ease-in-out',
                backdropFilter: state === 'entered' ? 'blur(8px)' : 'blur(0px)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }
            }}
          >
            <div
              style={{
                ...transitionStyles[state as keyof typeof transitionStyles],
                transition: 'all 200ms ease-in-out',
              }}
            >
              <ModalDialog
                variant="plain"
                aria-labelledby="create-application-modal"
                aria-describedby="create-application-modal-desc"
                sx={{
                  borderRadius: '20px',
                  maxHeight: '90vh',
                  overflow: 'auto'
                }}
              >
                <ModalClose sx={{ borderRadius: 250 }} />
                <Typography id="create-application-modal" level="h4">
                  {t.api.create_new}
                </Typography>
                <Typography id="create-application-modal-desc" level="body-sm">
                  {t.api.fill_details}
                </Typography>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateApp();
                  }}
                  className="mt-4"
                >
                  <Stack spacing={2}>
                    <FormControl>
                      <FormLabel>{t.api.name}</FormLabel>
                      <Input
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        placeholder={t.api.name}
                        sx={{ borderRadius: '20px' }}
                      />
                      <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                        {t.api.app_name_desc}
                      </Typography>
                    </FormControl>
                    <FormControl>
                      <Tooltip arrow placement="top" color="danger" variant="outlined" title={t.api.icon_tooltip}>
                        <FormLabel sx={{ color: 'red' }}>{t.api.icon}</FormLabel>
                      </Tooltip>
                      <Input
                        value={newApp.avatar}
                        disabled
                        onChange={(e) => setNewApp({ ...newApp, avatar: e.target.value })}
                        placeholder="https://placehold.co/256x256"
                        sx={{ borderRadius: '20px' }}
                      />
                      <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                        {t.api.app_icon_desc}
                      </Typography>
                    </FormControl>
                    <FormControl>
                      <FormLabel>{t.api.description}</FormLabel>
                      <Textarea
                        value={newApp.description || ''}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        placeholder={t.api.description}
                        minRows={2}
                        sx={{ borderRadius: '20px' }}
                      />
                      <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                        {t.api.app_desc_desc}
                      </Typography>
                    </FormControl>
                    <Button type="submit" sx={{ mt: 1, borderRadius: '20px' }}>
                      {t.api.create_app}
                    </Button>
                  </Stack>
                </form>
              </ModalDialog>
            </div>
          </Modal>
        )}
      </Transition>

      <Transition in={!!selectedApp} timeout={200}>
        {(state) => (
          <Modal
            open={state !== 'exited'}
            onClose={() => {
              setSelectedApp(null);
              setEditingApp(null);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& .MuiModal-backdrop': {
                transition: 'all 200ms ease-in-out',
                backdropFilter: state === 'entered' ? 'blur(8px)' : 'blur(0px)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
              }
            }}
          >
            <div
              style={{
                ...transitionStyles[state as keyof typeof transitionStyles],
                transition: 'all 200ms ease-in-out',
                width: '100%',
                height: '100%',
              }}
            >
              <ModalDialog
                aria-labelledby="application-details-modal"
                sx={{
                  borderRadius: '0px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  margin: 0,
                  padding: '2rem',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  border: "none"
                }}
              >
                {selectedApp && (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <Typography level="h3">{editingApp?.name}</Typography>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveApp}
                          variant="solid"
                          color="neutral"
                          sx={{ borderRadius: '20px', bgcolor: '#8B5CF6', '&:hover': { bgcolor: '#7C3AED' } }}
                          loading={saving}
                          disabled={saving}
                        >
                          {t.api.save} {!isMobile && t.api.changes}
                        </Button>
                        <IconButton
                          onClick={() => {
                            setSelectedApp(null);
                            setEditingApp(null);
                          }}
                          sx={{ borderRadius: 250 }}
                        >
                          <X />
                        </IconButton>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8 h-[calc(100vh-8rem)]">
                      <div className={cn(
                        "flex flex-col items-left gap-6 md:w-1/3 p-8 rounded-[24px]",
                        "backdrop-blur-sm bg-white/50 dark:bg-black/50",
                        "border border-purple-100/20 dark:border-purple-900/20",
                        "md:sticky md:top-0 md:self-start"
                      )}>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-[24px] blur-xl" />
                          <img
                            src={editingApp?.avatar || ''}
                            alt={editingApp?.name || ''}
                            width={192}
                            height={192}
                            style={{borderRadius: "24px"}}
                            className="relative w-48 h-48 rounded-[24px] object-cover shadow-lg"
                          />
                        </div>
                        <div className="text-left space-y-3">
                          <div className="space-y-1">
                            <Typography level="h4" className="font-medium tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {editingApp?.name}
                            </Typography>
                            <Typography level="body-sm" className="text-gray-500 dark:text-gray-400 tracking-wide">
                              {editingApp?.description || t.api.no_info}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/50">
                              <NumberTicker value={editingApp?.usages || 0} className="text-purple-600 dark:text-purple-400" />
                              <MdDataUsage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow overflow-y-auto pr-2">
                        <Tabs
                          defaultValue="general"
                          value={activeTab}
                          onChange={(_, value) => setActiveTab(value as string)}
                          sx={{
                            scrollbarWidth: 'none',
                            '--Tabs-gap': '0px',
                            '--TabPanel-padding': '24px 0 0 0',
                            '--TabList-radius': '20px',
                            '--TabList-padding': '4px',
                            '--TabList-minHeight': '40px',
                            '--TabList-background': 'rgba(0 0 0 / 0.05)',
                            '--TabList-justifyContent': 'flex-start',
                            '--Tab-radius': '16px',
                            '--Tab-minHeight': '32px',
                            '--Tab-padding': '0 16px',
                            '--Tab-gap': '8px',
                            '--Tab-fontSize': '0.875rem',
                            '--Tab-fontWeight': '500',
                            '--Tab-color': 'rgba(0 0 0 / 0.6)',
                            '--Tab-hoverColor': 'rgba(0 0 0 / 0.8)',
                            '--Tab-selectedColor': 'rgba(0 0 0 / 0.9)',
                            '--Tab-selectedBackground': 'white',
                            '--Tab-selectedShadow': '0 2px 4px rgba(0 0 0 / 0.05)',
                            '--Tab-selectedHoverBackground': 'white',
                            '--Tab-selectedHoverColor': 'rgba(0 0 0 / 0.9)',
                            '--Tab-selectedHoverShadow': '0 2px 4px rgba(0 0 0 / 0.05)',
                            '--Tab-selectedActiveBackground': 'white',
                            '--Tab-selectedActiveColor': 'rgba(0 0 0 / 0.9)',
                            '--Tab-selectedActiveShadow': '0 2px 4px rgba(0 0 0 / 0.05)',
                            '--Tab-disabledColor': 'rgba(0 0 0 / 0.3)',
                            '--Tab-disabledBackground': 'transparent',
                            '--Tab-disabledShadow': 'none',
                            '--Tab-disabledHoverBackground': 'transparent',
                            '--Tab-disabledHoverColor': 'rgba(0 0 0 / 0.3)',
                            '--Tab-disabledHoverShadow': 'none',
                            '--Tab-disabledActiveBackground': 'transparent',
                            '--Tab-disabledActiveColor': 'rgba(0 0 0 / 0.3)',
                            '--Tab-disabledActiveShadow': 'none',
                            width: isMobile ? '100%' : '60vw',
                            px: 0,
                            '& .MuiTabs-indicator': {
                              display: 'none'
                            }
                          }}
                        >
                          <TabList
                            variant="soft"
                            sx={{
                              borderRadius: '20px',
                              p: 0.5,
                              bgcolor: 'background.level1',
                              display: 'flex',
                              '& .MuiTab-root': {
                                flex: 1,
                                minWidth: 0,
                                maxWidth: 'none',
                                width: '50%'
                              }
                            }}
                          >
                            <Tab disableIndicator value="general">{t.api.general}</Tab>
                            <Tab disableIndicator value="oauth">{t.api.oauth}</Tab>
                          </TabList>
                          <TabPanel sx={{ px: 0, width: '100%' }} value="general">
                            <Stack spacing={3} sx={{ width: '100%' }}>
                              <div className="bg-purple-50/10 dark:bg-purple-950/10 rounded-[20px] p-6 w-full">
                                <Typography level="h4" className="mb-4">{t.api.app_settings}</Typography>
                                <Typography level="body-sm" className="mb-6 text-gray-500 dark:text-gray-400 pb-4">
                                  {t.api.app_settings_desc}
                                </Typography>
                                <FormControl>
                                  <FormLabel>{t.api.name}</FormLabel>
                                  <Input
                                    value={editingApp?.name}
                                    onChange={(e) => editingApp && handleUpdateApp({ ...editingApp, name: e.target.value })}
                                    sx={{ borderRadius: '20px' }}
                                  />
                                  <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                    {t.api.app_name_desc}
                                  </Typography>
                                </FormControl>
                                <FormControl className="mt-4">
                                  <Tooltip arrow placement="top" color="danger" variant="outlined" title={t.api.icon_tooltip}>
                                    <FormLabel sx={{ color: 'red' }}>{t.api.icon}</FormLabel>
                                  </Tooltip>
                                  <Input
                                    disabled
                                    value={editingApp?.avatar}
                                    onChange={(e) => editingApp && handleUpdateApp({ ...editingApp, avatar: e.target.value })}
                                    sx={{ borderRadius: '20px' }}
                                  />
                                  <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                    {t.api.app_icon_desc}
                                  </Typography>
                                </FormControl>
                                <FormControl className="mt-4">
                                  <FormLabel>{t.api.description}</FormLabel>
                                  <Textarea
                                    value={editingApp?.description || ''}
                                    onChange={(e) => editingApp && handleUpdateApp({ ...editingApp, description: e.target.value })}
                                    minRows={3}
                                    sx={{ borderRadius: '20px' }}
                                  />
                                  <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                    {t.api.app_desc_desc}
                                  </Typography>
                                </FormControl>
                                <div className="mt-6 p-4 bg-white dark:bg-purple-950/40 rounded-[20px] border border-purple-100/20 dark:border-purple-900/20">
                                  <Typography level="title-sm" className="mb-2">{t.api.credentials}</Typography>
                                  <FormControl className="mt-4">
                                    <FormLabel>{t.api.app_id}</FormLabel>
                                    <div
                                      onClick={() => {
                                        if (editingApp?.id) {
                                          navigator.clipboard.writeText(editingApp.id);
                                        }
                                      }}
                                      className="font-mono font-mono text-sm cursor-pointer">
                                      <span className="block opacity-100">
                                        {editingApp?.id}
                                      </span>
                                    </div>
                                    <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                      {t.api.app_id_desc}
                                    </Typography>
                                  </FormControl>
                                  <FormControl className="mt-4">
                                    <FormLabel>{t.api.api_key}</FormLabel>
                                    <div className="flex items-center gap-2 group">
                                      <div
                                        className="relative font-mono text-sm cursor-pointer"
                                        onClick={() => {
                                          if (editingApp?.key) {
                                            navigator.clipboard.writeText(editingApp.key);
                                          }
                                        }}
                                      >
                                        <span className="block opacity-100 group-hover:opacity-0 transition-opacity duration-200">
                                          {editingApp?.key ? `scr-${'*'.repeat(32)}` : ''}
                                        </span>
                                        <span className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          {editingApp?.key}
                                        </span>
                                      </div>
                                    </div>
                                    <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                      {t.api.api_key_desc}
                                    </Typography>
                                  </FormControl>
                                </div>
                              </div>
                            </Stack>
                          </TabPanel>
                          <TabPanel sx={{ px: 0, width: '100%' }} value="oauth">
                            <Stack spacing={3} sx={{ width: '100%' }}>
                              <div className="bg-purple-50/10 dark:bg-purple-950/10 rounded-[20px] p-6 w-full">
                                <Typography level="h4" className="mb-4">{t.api.oauth_config}</Typography>
                                <Typography level="body-sm" className="mb-6 text-gray-500 dark:text-gray-400 pb-4">
                                  {t.api.oauth_config_desc}
                                </Typography>
                                <FormControl>
                                  <FormLabel>{t.api.enable_oauth}</FormLabel>
                                  <div className="flex items-center">
                                    <Switch
                                      disabled
                                      checked={editingApp?.oauth?.enabled || true}
                                      onChange={(e) => editingApp && handleUpdateApp({
                                        ...editingApp,
                                        oauth: {
                                          enabled: e.target.checked,
                                          redirectUri: editingApp.oauth?.redirectUri || '',
                                          scopes: editingApp.oauth?.scopes || []
                                        }
                                      })}
                                    />
                                  </div>
                                </FormControl>
                                {editingApp?.oauth?.enabled || true && (
                                  <>
                                    <FormControl className="mt-4">
                                      <FormLabel>{t.api.redirect_uri}</FormLabel>
                                      <Input
                                        value={editingApp?.oauth?.redirectUri || ''}
                                        onChange={(e) => editingApp && handleUpdateApp({
                                          ...editingApp,
                                          oauth: {
                                            enabled: editingApp.oauth?.enabled || false,
                                            redirectUri: e.target.value,
                                            scopes: editingApp.oauth?.scopes || []
                                          }
                                        })}
                                        placeholder="https://your-app.com/callback"
                                        sx={{ borderRadius: '20px' }}
                                      />
                                      <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                        {t.api.redirect_uri_desc}
                                      </Typography>
                                    </FormControl>
                                    <FormControl className="mt-4">
                                      <FormLabel>{t.api.scopes}</FormLabel>
                                      <Select
                                        multiple
                                        value={editingApp?.oauth?.scopes || []}
                                        onChange={(_, newValue) => editingApp && handleUpdateApp({
                                          ...editingApp,
                                          oauth: {
                                            enabled: editingApp.oauth?.enabled || false,
                                            redirectUri: editingApp?.oauth?.redirectUri || '',
                                            scopes: newValue
                                          }
                                        })}
                                        renderValue={(selected) => (
                                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {selected.map((option, index) => {
                                              let label = '';
                                              if (option.value === 'identify') label = t.api.identify;
                                              else if (option.value === 'email') label = t.api.email;
                                              else if (option.value === 'profile') label = t.api.profile;
                                              else if (option.value === 'connections') label = t.api.connections;
                                              else if (option.value === 'token') label = t.api.token;
                                              else label = String(option.value);
                                              return (
                                                <Typography key={option.value} level="body-sm">
                                                  {label}
                                                  {index < selected.length - 1 ? ', ' : ''}
                                                </Typography>
                                              );
                                            })}
                                          </Box>
                                        )}
                                        sx={{ borderRadius: '20px' }}
                                      >
                                        <Option value="identify">
                                          <div>
                                            <Typography level="body-sm">{t.api.identify}</Typography>
                                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                              {t.api.identify_desc}
                                            </Typography>
                                          </div>
                                        </Option>
                                        <Option value="email">
                                          <div>
                                            <Typography level="body-sm">{t.api.email}</Typography>
                                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                              {t.api.email_desc}
                                            </Typography>
                                          </div>
                                        </Option>
                                        <Option value="profile">
                                          <div>
                                            <Typography level="body-sm">{t.api.profile}</Typography>
                                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                              {t.api.profile_desc}
                                            </Typography>
                                          </div>
                                        </Option>
                                        <Option value="connections">
                                          <div>
                                            <Typography level="body-sm">{t.api.connections}</Typography>
                                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                              {t.api.connections_desc}
                                            </Typography>
                                          </div>
                                        </Option>
                                        <Option value="token">
                                          <div>
                                            <Typography level="body-sm">{t.api.token}</Typography>
                                            <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                                              {t.api.token_desc}
                                            </Typography>
                                          </div>
                                        </Option>
                                      </Select>
                                      <Typography level="body-xs" className="mt-1 text-gray-500 dark:text-gray-400 pt-1">
                                        {t.api.scopes_desc}
                                      </Typography>
                                    </FormControl>
                                    <div className="mt-6 p-4 bg-white dark:bg-purple-950/40 rounded-[20px] border border-purple-100/20 dark:border-purple-900/20">
                                      <Typography level="title-sm" className="mb-2">{t.api.oauth_url}</Typography>
                                      {(editingApp?.oauth?.enabled || true) && editingApp?.oauth?.redirectUri ? (
                                        <Link
                                          level="body-sm"
                                          onClick={() => window.open(`${getOAuthBaseUrl()}/oauth2/authorize?client_id=${editingApp.id}&redirect_uri=${encodeURIComponent(editingApp?.oauth?.redirectUri ? editingApp.oauth.redirectUri : getOAuthBaseUrl() + '/')}&scope=${(editingApp?.oauth?.scopes || []).join(',')}`, '_blank')}
                                          underline="none"
                                          className="font-mono break-all"
                                        >
                                          {`${getOAuthBaseUrl()}/oauth2/authorize?client_id=${editingApp.id}&redirect_uri=${encodeURIComponent(editingApp.oauth.redirectUri)}&scope=${(editingApp.oauth.scopes || []).join(',')}`}
                                        </Link>
                                      ) : (
                                        <Typography level="body-sm" className="font-mono break-all">
                                          {t.api.enable_oauth_url}
                                        </Typography>
                                      )}
                                      <Typography level="body-xs" className="mt-2 text-gray-500 dark:text-gray-400">
                                        {t.api.oauth_url_desc}
                                      </Typography>
                                    </div>
                                  </>
                                )}
                              </div>
                            </Stack>
                          </TabPanel>
                        </Tabs>
                      </div>
                    </div>
                  </div>
                )}
              </ModalDialog>
            </div>
          </Modal>
        )}
      </Transition >
    </main >
  );
}
