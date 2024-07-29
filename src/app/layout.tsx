"use client";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { DATA } from "@/data/siteSettings";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import Background from '../components/bg.png';
import DotPattern from "@/components/magicui/dot-pattern";
import GridPattern from "@/components/magicui/grid-pattern";
import AuthProvider from "@/contexts/AuthProvider";
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import { getInitColorSchemeScript } from '@mui/joy/styles';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#101314',
        },
        text: {
          primary: '#ffffff',
        },
      },
    },
  },
  components: {
    JoySwitch: {
      styleOverrides: {
        root: {
          '--Switch-trackBackground': '#EE5E52',
          '&:hover': {
            '--Switch-trackBackground': '#EE5E52',
          },
          '&.Mui-checked': {
            '--Switch-trackBackground': '#4a1680',
            '&:hover': {
              '--Switch-trackBackground': '#4a1680',
            },
          },
        },
      }
    },
    JoyInput: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderColor: '#4a1680',
          transition: 'border-color 0.3s',
          '--Input-focusedHighlight': 'rgba(0,0,0,.0)',
          '--Input-focusedThickness': '0rem',
          '&:hover': {
            borderColor: '#7b1fa2',
          },
          '&:focus': {
            outline: 'none',
          },
          '&.Mui-focused': {
            outline: 'none',
            borderColor: '#8e24aa',
          },
          '&.MuiInputBase-root': {
            '& fieldset': {
              borderColor: '#6a1b9a',
            },
            '&:hover fieldset': {
              borderColor: '#7b1fa2',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#8e24aa',
            },
          },
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#4a1680',
          transition: 'background-color 0.1s',
          '&:hover': {
            backgroundColor: '#7b1fa2',
          },
          '&:active': {
            backgroundColor: '#8e24aa',
          },
        },
      },
    },
  }
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>SCREW: ID</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/x-icon" href="https://screwltd.com/faviconMain.ico"/>
      </head>
      <body
        className={cn(
          "min-h-screen bg-black font-sans antialiased max-w-4xl mx-auto py-12 sm:py-24",
          fontSans.variable
        )}
      >{getInitColorSchemeScript({ defaultMode: 'dark' })}
        <CssVarsProvider theme={theme} defaultMode="dark">
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="dark">
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
                {children}
                <Navbar />
            </ThemeProvider>
          </AuthProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}
