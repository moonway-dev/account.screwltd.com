"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { Select, Tooltip, Option, Stack, Button, Typography, Input, Textarea, Modal, ModalDialog, ModalClose, FormControl, FormLabel, IconButton, Box, useTheme } from '@mui/joy';
import { useAuth } from '@/contexts/AuthProvider';
import { KeyRound, Plus, X } from "lucide-react";
import NumberTicker from "@/components/magicui/number-ticker";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Transition } from 'react-transition-group';
import { useMedia } from "react-use";

interface Application {
  key: string;
  usages: number;
  name: string;
  avatar: string;
  description: string | null;
}

const transitionStyles = {
  entering: { opacity: 0, transform: 'scale(0.95)' },
  entered: { opacity: 1, transform: 'scale(1)' },
  exiting: { opacity: 0, transform: 'scale(0.95)' },
  exited: { opacity: 0, transform: 'scale(0.95)' },
  unmounted: { opacity: 0, transform: 'scale(0.95)' }
} as const;

export default function ApiPage() {
  const { user } = useAuth();
  const isMobile = useMedia(`(max-width: ${useTheme().breakpoints.values.sm}px)`)
  const [open, setOpen] = useState(false);
  const [testModeModalOpen, setTestModeModalOpen] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [editingApp, setEditingApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [newApp, setNewApp] = useState<Partial<Application>>({
    name: 'Application',
    avatar: 'https://placehold.co/256x256',
    description: null
  });

  useEffect(() => {
    const savedApps = localStorage.getItem('applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const handleCreateApp = () => {
    const newApplication: Application = {
      key: uuidv4(),
      usages: 0,
      name: newApp.name || 'Application',
      avatar: newApp.avatar || 'https://placehold.co/256x256',
      description: newApp.description || null
    };

    setApplications([...applications, newApplication]);
    setOpen(false);
    setNewApp({
      name: 'Application',
      avatar: 'https://placehold.co/256x256',
      description: null
    });
  };

  const handleUpdateApp = (updatedApp: Application) => {
    setEditingApp(updatedApp);
  };

  const handleSaveApp = () => {
    if (editingApp) {
      setApplications(applications.map(app =>
        app.key === editingApp.key ? editingApp : app
      ));
      setSelectedApp(null);
      setEditingApp(null);
    }
  };

  return (
    <main className="flex flex-col items-center p-6">
      <div className="w-full max-w-5xl">
        <BlurFade delay={0.05}>
          <div className="flex justify-between items-center w-full mb-8">
            <div>
              <p className={isMobile ? 'font-medium text-lg mb-1' : 'font-medium text-2xl mb-1'}>SCREW: DEVELOPER</p>
              <p className="text-gray-500 dark:text-gray-400">{isMobile ? "Manage your applications" : "Manage your applications and API keys"}</p>
            </div>
            <Button
              startDecorator={<Plus />}
              onClick={() => setOpen(true)}
              variant="solid"
              color="primary"
              sx={{ borderRadius: '20px' }}
            >
              Create {!isMobile && 'Application'}
            </Button>
          </div>
        </BlurFade>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {applications.map((app, index) => (
            <BlurFade key={index} delay={parseFloat(`0.${index + 1}5`)}>
              <div
                onClick={() => setSelectedApp(app)}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-[20px] cursor-pointer transition-all duration-200",
                  "bg-white hover:bg-gray-50 [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                  "transform-gpu dark:bg-black dark:hover:bg-gray-900 dark:[border:1px_solid_rgba(147,112,219,.15)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
                  "flex flex-col items-center justify-center gap-3 p-4"
                )}
              >
                <div className="relative w-24 h-24">
                  <img
                    src={app.avatar}
                    alt={app.name}
                    className="w-full h-full rounded-[20px] object-cover transition-transform duration-200 group-hover:scale-90"
                  />
                  <div className="absolute inset-0 rounded-[20px] bg-black/40 group-hover:bg-black/20 transition-colors duration-200" />
                </div>
                <div className="text-center">
                  <Typography level="title-sm" className="font-medium">{app.name}</Typography>
                  {app.description && (
                    <Typography noWrap level="body-xs" className="text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {app.description.slice(0, 18)}{app.description.length > 18 && '...'}
                    </Typography>
                  )}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>

        {applications.length === 0 && (
          <BlurFade delay={0.25}>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 rounded-[20px] bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
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
                color="primary"
                sx={{ borderRadius: '20px' }}
              >
                Create Application
              </Button>
            </div>
          </BlurFade>
        )}
      </div>

      <Transition in={testModeModalOpen} timeout={200}>
        {(state) => (
          <Modal
            open={state !== 'exited'}
            onClose={() => setTestModeModalOpen(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                ...transitionStyles[state as keyof typeof transitionStyles],
                transition: 'all 200ms ease-in-out',
              }}
            >
              <ModalDialog
                aria-labelledby="test-mode-modal"
                aria-describedby="test-mode-modal-desc"
                sx={{
                  borderRadius: '20px',
                  maxWidth: '500px',
                  maxHeight: '90vh',
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography id="test-mode-modal" level="h4">
                  System Maintenance Notice
                </Typography>
                <Typography id="test-mode-modal-desc" level="body-md" className="text-gray-500 dark:text-gray-400">
                  Our systems are currently being refactored. Everything is working in test mode, and changes cannot be saved at this time. We apologize for any inconvenience.
                </Typography>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <Button
                    onClick={() => setTestModeModalOpen(false)}
                    variant="solid"
                    color="primary"
                    sx={{ borderRadius: '20px', width: '100%' }}
                  >
                    I Understand
                  </Button>
                </Box>
              </ModalDialog>
            </div>
          </Modal>
        )}
      </Transition>

      <Transition in={open} timeout={200}>
        {(state) => (
          <Modal
            open={state !== 'exited'}
            onClose={() => setOpen(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                ...transitionStyles[state as keyof typeof transitionStyles],
                transition: 'all 200ms ease-in-out',
              }}
            >
              <ModalDialog
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
                  Create New Application
                </Typography>
                <Typography id="create-application-modal-desc" level="body-sm">
                  Fill in the details for your new application.
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
                      <FormLabel>Name</FormLabel>
                      <Input
                        value={newApp.name}
                        onChange={(e) => setNewApp({ ...newApp, name: e.target.value })}
                        placeholder="Application Name"
                        sx={{ borderRadius: '20px' }}
                      />
                    </FormControl>
                    <FormControl>
                      <Tooltip arrow placement="top" color="danger" variant="outlined" title="To install the image, you need to approve your company URL.">
                        <FormLabel sx={{ color: 'red' }}>Icon</FormLabel>
                      </Tooltip>
                      <Input
                        value={newApp.avatar}
                        disabled
                        onChange={(e) => setNewApp({ ...newApp, avatar: e.target.value })}
                        placeholder="https://placehold.co/256x256"
                        sx={{ borderRadius: '20px' }}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        value={newApp.description || ''}
                        onChange={(e) => setNewApp({ ...newApp, description: e.target.value })}
                        placeholder="Application Description"
                        minRows={2}
                        sx={{ borderRadius: '20px' }}
                      />
                    </FormControl>
                    <Button type="submit" sx={{ mt: 1, borderRadius: '20px' }}>
                      Create Application
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
                }}
              >
                {selectedApp && (
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                      <Typography level="h3">{editingApp?.name || selectedApp.name} {!isMobile && 'Details'}</Typography>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveApp}
                          variant="solid"
                          color="primary"
                          sx={{ borderRadius: '20px' }}
                        >
                          Save {!isMobile && 'Changes'}
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
                    <div className="flex flex-col md:flex-row gap-8 flex-grow">
                      <div className={isMobile ? "flex flex-col items-center gap-4 md:w-1/3" : "flex flex-col items-left gap-4 md:w-1/3"}>
                        <img
                          src={editingApp?.avatar || selectedApp.avatar}
                          alt={editingApp?.name || selectedApp.name}
                          className="w-48 h-48 rounded-[20px] object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <Stack spacing={3}>
                          <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                              value={editingApp?.name || selectedApp.name}
                              onChange={(e) => handleUpdateApp({ ...(editingApp || selectedApp), name: e.target.value })}
                              sx={{ borderRadius: '20px' }}
                            />
                          </FormControl>
                          <FormControl>
                            <Tooltip arrow placement="top" color="danger" variant="outlined" title="To install the image, you need to approve your company URL.">
                              <FormLabel sx={{ color: 'red' }}>Icon</FormLabel>
                            </Tooltip>
                            <Input
                              disabled
                              value={editingApp?.avatar || selectedApp.avatar}
                              onChange={(e) => handleUpdateApp({ ...(editingApp || selectedApp), avatar: e.target.value })}
                              sx={{ borderRadius: '20px' }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                              value={editingApp?.description || selectedApp.description || ''}
                              onChange={(e) => handleUpdateApp({ ...(editingApp || selectedApp), description: e.target.value })}
                              minRows={3}
                              sx={{ borderRadius: '20px' }}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel>Key</FormLabel>
                            <Typography
                            >{selectedApp.key}</Typography>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Usages</FormLabel>
                            {selectedApp.usages != 0 ? (
                              <NumberTicker value={selectedApp.usages} />
                            ) : (
                              <p>0</p>
                            )}
                          </FormControl>
                        </Stack>
                      </div>
                    </div>
                  </div>
                )}
              </ModalDialog>
            </div>
          </Modal>
        )}
      </Transition>
    </main>
  );
}
