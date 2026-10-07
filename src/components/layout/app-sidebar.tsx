'use client'

import { usePathname } from "next/navigation";
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import Link from "next/link";
import { BanknoteIcon, LayoutDashboardIcon, WalletMinimalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboardIcon />,
    href: '/dashboard'
  },
  {
    label: 'Transaction',
    icon: <BanknoteIcon />,
    href: '/dashboard/transaction'
  }
]

export function AppSidebar(){
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="p-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            size="lg"
                            className="hover:bg-transparent h-10 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!"
                        >
                            <Link href='/dashboard' className="flex items-center gap-2.5">
                                <WalletMinimalIcon className="text-primary size-5! shrink-0" />
                                <span className="text-xl font-black tracking-tight text-foreground group-data-[collapsible=icon]:hidden">
                                    Fina App
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu className="gap-1.5">
                        {sidebarItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.label}
                                        className={cn(
                                            'h-10 rounded-full text-sm font-semibold transition-colors',
                                            isActive
                                                ? 'bg-primary text-primary-foreground font-bold hover:bg-[#cdffad] hover:text-primary-foreground'
                                                : 'text-body hover:bg-secondary hover:text-foreground'
                                        )}
                                    >
                                        <Link href={item.href} className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}