import { Icons } from "@/components/icons";
import { Link, UserRound, Cog, Bell, CodeXml } from "lucide-react";

export const DATA = {
  navbar: [
    { href: "/", icon: UserRound, label: "Profile" },
    { href: "/notifications", icon: Bell, label: "Notifications" },
    { href: "/settings", icon: Cog, label: "Settings" },
    { href: "/links", icon: Link, label: "Linked Accounts" },
    { href: "/api", icon: CodeXml, label: "Developer Portal" },
  ],
} as const;
