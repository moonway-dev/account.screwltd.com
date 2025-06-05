import { Icons } from "@/components/icons";
import { Link, UserRound, Cog, Bell, CodeXml } from "lucide-react";

export function getNavbarData(t: any) {
  return [
    { href: "/", icon: UserRound, label: t.navbar.profile },
    { href: "/notifications", icon: Bell, label: t.navbar.notifications },
    { href: "/settings", icon: Cog, label: t.navbar.settings },
    { href: "/links", icon: Link, label: t.navbar.linked_accounts },
    { href: "/api", icon: CodeXml, label: t.navbar.developer_portal },
  ];
}
