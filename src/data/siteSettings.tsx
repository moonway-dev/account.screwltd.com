import { Icons } from "@/components/icons";
import { Link, UserRound, Cog, Bell, CodeXml } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import en from '@/locales/en';
import ru from '@/locales/ru';

function useTranslation() {
  const { language } = useLanguage();
  return language === 'ru' ? ru : en;
}

export function getNavbarData() {
  const t = useTranslation();
  return [
    { href: "/", icon: UserRound, label: t.navbar.profile },
    { href: "/notifications", icon: Bell, label: t.navbar.notifications },
    { href: "/settings", icon: Cog, label: t.navbar.settings },
    { href: "/links", icon: Link, label: t.navbar.linked_accounts },
    { href: "/api", icon: CodeXml, label: t.navbar.developer_portal },
  ];
}
