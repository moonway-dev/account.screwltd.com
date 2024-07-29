import { Icons } from "@/components/icons";
import { Link, UserRound, Cog, KeyRound, Bell } from "lucide-react";

export const DATA = {
  navbar: [
    { href: "/", icon: UserRound, label: "Profile" },
    //{ href: "/", icon: Bell, label: "Notifications" },
    { href: "/settings", icon: Cog, label: "Settings" },
    { href: "/links", icon: Link, label: "Linked Accounts" },
    { href: "/api", icon: KeyRound, label: "API" },
  ],
} as const;
