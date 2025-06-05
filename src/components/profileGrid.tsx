import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Link, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import Globe from "@/components/magicui/globe";
import { AnimatedBeamMultipleOutputDemo } from "./beam";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { AnimatedListDemo } from "./list";
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

function useTranslation() {
  const { language } = useLanguage();
  return language === 'ru' ? ru : en;
}

function getFeatures(t: any, files: any) {
  return [
    {
      Icon: FileTextIcon,
      name: t.profileGrid.save_files,
      description: t.profileGrid.get_storage,
      href: "/api",
      cta: t.profileGrid.developer_portal,
      className: "col-span-3 lg:col-span-1",
      background: (
        <Marquee
          pauseOnHover
          className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
        >
          {files.map((f: any, idx: any) => (
            <figure
              key={idx}
              className={cn(
                "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
              )}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="flex flex-col">
                  <figcaption className="text-sm font-medium dark:text-white ">
                    {f.name}
                  </figcaption>
                </div>
              </div>
              <blockquote
                className="mt-2 text-xs"
                dangerouslySetInnerHTML={{ __html: f.body }}
              />
            </figure>
          ))}
        </Marquee>
      ),
    },
    {
      Icon: BellIcon,
      name: t.profileGrid.notifications,
      description: t.profileGrid.get_notified,
      href: "/notifications",
      cta: t.profileGrid.notifications_cta,
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
      ),
    },
    {
      Icon: Link,
      name: t.profileGrid.integrations,
      description: t.profileGrid.connect_accounts,
      href: "/links",
      cta: t.profileGrid.linked_accounts,
      className: "col-span-3 lg:col-span-2",
      background: (
        <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
      ),
    },
    {
      Icon: Shield,
      name: t.profileGrid.safely,
      description: t.profileGrid.protect_account,
      className: "col-span-3 lg:col-span-1",
      href: "/settings",
      cta: t.profileGrid.settings,
      background: (
        <Globe
          className="absolute right-0 top-10 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-105"
        />
      ),
    },
  ];
}

export function BentoDemo() {
  const t = useTranslation();
  const files = [
    {
      name: "REMNANT",
      body: "Size: <b>200 GB</b><br/>Type: <b>Folder</b><br/><br/>Note: This is the source code."
    },
    {
      name: "SCREW: WS",
      body: "I don't know what to write here, because I wrote about the source code before, so let it just be this text here. beep boop boop beep beep boop boop beep ",
    },
  ];
  const features = getFeatures(t, files);
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
