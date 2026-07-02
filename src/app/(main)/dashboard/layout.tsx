import type { ReactNode } from "react";

import { cookies } from "next/headers";
import Link from "next/link";

import { siGithub } from "simple-icons";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";
  const [variant, collapsible] = await Promise.all([
    getPreference("sidebar_variant"),
    getPreference("sidebar_collapsible"),
  ]);

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} collapsible={collapsible} />
      <SidebarInset
        className={cn(
          "[html[data-content-layout=centered]_&>*]:mx-auto",
          "[html[data-content-layout=centered]_&>*]:w-full",
          "[html[data-content-layout=centered]_&>*]:max-w-screen-2xl",
          "peer-data-[variant=inset]:border",
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 overflow-x-clip flex flex-col min-h-screen", // ফুটারকে নিচে পুশ করার জন্য flex এবং min-h-screen অ্যাড করা হয়েছে
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-1 lg:gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
              />
              <SearchDialog />
            </div>
            <div className="flex items-center gap-2">
              <LayoutControls />
              <ThemeSwitcher />
              <Button asChild size="icon">
                <Link
                  prefetch={false}
                  href="https://github.com/arhamkhnz/next-shadcn-admin-dashboard"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open GitHub repository"
                >
                  <SimpleIcon icon={siGithub} className="fill-primary-foreground" />
                </Link>
              </Button>
              <AccountSwitcher users={users} />
            </div>
          </div>
        </header>

        {/* মেইন ড্যাশবোর্ড কন্টেন্ট এরিয়া */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>

        {/* --- নিচে আপনার দেওয়া ফুটার সেকশন (Tailwind দিয়ে ডিজাইন রেডি) --- */}
        <footer className="w-full bg-slate-900 text-slate-300 py-12 px-6 mt-auto border-t border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* কলাম ১: ডেসক্রিপশন এবং পেমেন্ট গেটওয়ে */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">FlyTripVisa | 飞行旅行签证</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simplifying Global Mobility through AI-Driven Visa Support.
                We transform complex visa application processes into seamless, automated journeys for travelers, businesses, and families worldwide.
              </p>
              <p className="text-xs text-slate-500 italic leading-normal">
                Note: FlyTripVisa | 飞行旅行签证 is an independent AI-powered service provider. We are not affiliated with any government immigration department. Visa approval is subject to the discretion of the issuing authority.
              </p>
              
              {/* পেমেন্ট মেথড টেক্সট বা আইকন হোল্ডার */}
              <div className="flex gap-2 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded">Visa</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Mastercard</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Alipay</span>
                <span className="px-2 py-1 bg-slate-800 rounded">WeChat</span>
              </div>
            </div>

            {/* কলাম ২: গ্লোবাল অফিস */}
            <div className="space-y-4 md:pl-8">
              <h4 className="text-xl font-bold text-white">Global Presence</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><strong className="text-slate-200">HQ:</strong> Dubai, UAE</li>
                <li><strong className="text-slate-200">HQ China:</strong> Shenzhen, China</li>
                <li><strong className="text-slate-200">Bangladesh:</strong> Dhaka Office</li>
              </ul>
            </div>

            {/* কলাম ৩: কন্ট্যাক্ট এবং সিকিউর পেমেন্ট */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">Contact</h4>
              <button className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-md hover:bg-blue-700 transition-all shadow-md tracking-wide">
                🔒 SECURE PAYMENT
              </button>
              <div className="text-sm text-slate-400 space-y-1">
                <p><strong>WhatsApp:</strong> +8801338354383</p>
                <p><strong>Email:</strong> visa@flytripvisa.site</p>
              </div>
            </div>

          </div>

          {/* ফুটার বটম লিংকসমূহ */}
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Refund Policy</span>
              <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms</span>
              <span className="hover:text-slate-300 cursor-pointer">Contact</span>
            </div>
            <p>© 2026 FLYTRIPVISA | 飞行旅行签证 . Official Document Specialists.</p>
          </div>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}
