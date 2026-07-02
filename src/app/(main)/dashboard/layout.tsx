import type { ReactNode } from "react";
import { cookies } from "next/headers";
import Image from "next/image"; // লোগো ইমেজের জন্য Next.js Image ব্যবহার করা বেস্ট

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";
import { getPreference } from "@/server/server-actions";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";

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
          "peer-data-[variant=inset]:border-0", // আপনার ছবির মতো বর্ডারলেস লুকের জন্য ০ করা হয়েছে
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 overflow-x-clip flex flex-col min-h-screen",
        )}
      >
        {/* --- মডিফাইড হেডার সেকশন (আপনার ছবি অনুযায়ী) --- */}
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            
            {/* বাম অংশ: সাইডবার ট্রিগার এবং ফ্লাইট্রিপ ভিসা লোগো ব্র্যান্ডিং */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-1 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
              />
              {/* মেইন ব্র্যান্ড লোগো এরিয়া */}
              <div className="flex items-center gap-2 pl-1">
                <img 
                  src="/logo.png" // আপনার public/ ফোল্ডারে থাকা লোগোর পাথ এখানে দিন
                  alt="FlyTrip Visa Logo" 
                  className="h-6 w-auto object-contain"
                />
                <span className="text-sm font-black tracking-wider text-red-600 uppercase flex items-center gap-1">
                  Fly Trip <span className="text-red-500 font-bold">Visa</span>
                </span>
              </div>
            </div>

            {/* ডান অংশ: ড্রাগন লোগো এবং প্রোফাইল অ্যাভাটার (আপনার ছবি অনুযায়ী) */}
            <div className="flex items-center gap-3">
              {/* ড্রাগন সার্কেল লোগো */}
              <div className="h-8 w-8 rounded-full overflow-hidden bg-black flex items-center justify-center border border-slate-200">
                <img 
                  src="/dragon-logo.png" // আপনার ড্রাগন লোগোর ইমেজ পাথ এখানে দিন
                  alt="Dragon Icon" 
                  className="h-full w-full object-cover"
                />
              </div>

              {/* ইউজার প্রোফাইল বা অ্যাকাউন্ট স্যুইচার */}
              <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                <AccountSwitcher users={users} />
              </div>
            </div>

          </div>
        </header>

        {/* মেইন ড্যাশবোর্ড কন্টেন্ট এরিয়া */}
        <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden p-4 has-data-[content-padding=false]:p-0 md:p-6 md:has-data-[content-padding=false]:p-0">
          {children}
        </div>

        {/* ফুটার সেকশন */}
        <footer className="w-full bg-slate-900 text-slate-300 py-12 px-6 mt-auto border-t border-slate-800精密">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">FlyTripVisa | 飞行旅行签证</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Simplifying Global Mobility through AI-Driven Visa Support.
                We transform complex visa application processes into seamless, automated journeys for travelers, businesses, and families worldwide.
              </p>
              <p className="text-xs text-slate-500 italic leading-normal">
                Note: FlyTripVisa | 飞行旅行签证 is an independent AI-powered service provider. We are not affiliated with any government immigration department. Visa approval is subject to the discretion of the issuing authority.
              </p>
            </div>
            <div className="space-y-4 md:pl-8">
              <h4 className="text-xl font-bold text-white">Global Presence</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><strong className="text-slate-200">HQ:</strong> Dubai, UAE</li>
                <li><strong className="text-slate-200">HQ China:</strong> Shenzhen, China</li>
                <li><strong className="text-slate-200">Bangladesh:</strong> Dhaka Office</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white">Contact</h4>
              <div className="text-sm text-slate-400 space-y-1">
                <p><strong>WhatsApp:</strong> +8801338354383</p>
                <p><strong>Email:</strong> visa@flytripvisa.site</p>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex gap-4">
              <span className="hover:text-slate-300 cursor-pointer">Refund Policy</span>
              <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-300 cursor-pointer">Terms</span>
              <span className="hover:text-slate-300 cursor-pointer">Contact</span>
            </div>
            <p>© 2026 FLYTRIPVISA | 飞行旅行签证 . Official Document Specialists And Fly AI Robot- Mini Web App .</p>
          </div>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}
