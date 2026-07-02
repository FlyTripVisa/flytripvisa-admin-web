import type { ReactNode } from "react";
import { cookies } from "next/headers";

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
          "peer-data-[variant=inset]:border-0",
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 overflow-x-clip flex flex-col min-h-screen",
        )}
      >
        {/* হেডার সেকশন */}
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
            "[html[data-navbar-style=sticky]_&]:sticky [html[data-navbar-style=sticky]_&]:top-0 [html[data-navbar-style=sticky]_&]:z-50 [html[data-navbar-style=sticky]_&]:overflow-hidden [html[data-navbar-style=sticky]_&]:rounded-t-[inherit] [html[data-navbar-style=sticky]_&]:bg-background/50 [html[data-navbar-style=sticky]_&]:backdrop-blur-md",
          )}
        >
          <div className="flex w-full items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mx-1 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
              />
              <div className="flex items-center gap-2 pl-1">
                <img 
                  src="/logo.png" 
                  alt="FlyTrip Visa Logo" 
                  className="h-6 w-auto object-contain"
                />
                <span className="text-sm font-black tracking-wider text-red-600 uppercase flex items-center gap-1">
                  Fly Trip <span className="text-red-500 font-bold">Visa</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-black flex items-center justify-center border border-slate-200">
                <img 
                  src="/dragon-logo.png" 
                  alt="Dragon Icon" 
                  className="h-full w-full object-cover"
                />
              </div>
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

        {/* --- মডিফাইড ফুটার সেকশন (বাটন রিমুভড + সোশ্যাল মিডিয়া যুক্ত) --- */}
        <footer className="w-full bg-transparent text-muted-foreground py-12 px-6 mt-auto border-t border-border">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* কলাম ১: ডেসক্রিপশন */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-foreground">FlyTripVisa | 飞行旅行签证</h4>
              <p className="text-sm leading-relaxed">
                Simplifying Global Mobility through AI-Driven Visa Support.
                We transform complex visa application processes into seamless, automated journeys for travelers, businesses, and families worldwide.
              </p>
              <p className="text-xs text-muted-foreground/70 italic leading-normal">
                Note: FlyTripVisa | 飞行旅行签证 is an independent AI-powered service provider. We are not affiliated with any government immigration department. Visa approval is subject to the discretion of the issuing authority.
              </p>
              
              <div className="flex gap-2 pt-2 text-xs font-semibold uppercase tracking-wider">
                <span className="px-2 py-1 bg-muted rounded border border-border text-foreground">Visa</span>
                <span className="px-2 py-1 bg-muted rounded border border-border text-foreground">Mastercard</span>
                <span className="px-2 py-1 bg-muted rounded border border-border text-foreground">Alipay</span>
                <span className="px-2 py-1 bg-muted rounded border border-border text-foreground">WeChat</span>
              </div>
            </div>

            {/* কলাম ২: গ্লোবাল অফিস */}
            <div className="space-y-4 md:pl-8">
              <h4 className="text-xl font-bold text-foreground">Global Presence</h4>
              <ul className="space-y-2 text-sm">
                <li><strong className="text-foreground">HQ:</strong> Dubai, UAE</li>
                <li><strong className="text-foreground">HQ China:</strong> Shenzhen, China</li>
                <li><strong className="text-foreground">Bangladesh:</strong> Dhaka Office</li>
              </ul>
            </div>

            {/* কলাম ৩: কন্ট্যাক্ট এবং সোশ্যাল মিডিয়া লিংকসমূহ */}
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-foreground">Contact & Socials</h4>
              <div className="text-sm space-y-1">
                <p><strong>WhatsApp:</strong> +8801338354383</p>
                <p><strong>Email:</strong> visa@flytripvisa.site</p>
              </div>

              {/* সোশ্যাল মিডিয়া আইকন গ্রিড */}
              <div className="pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">Connect With Us</p>
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">Facebook</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">Instagram</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">Telegram</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">TikTok</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">WeChat</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">Alipay</a>
                  <a href="#" className="px-2.5 py-1.5 bg-muted hover:bg-muted/80 rounded border border-border text-xs font-medium text-foreground transition-colors">Red Note</a>
                </div>
              </div>
            </div>

          </div>

          {/* ফুটার বটম লিংক */}
          <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/60">
            <div className="flex gap-4">
              <span className="hover:text-foreground cursor-pointer transition-colors">Refund Policy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
            </div>
            <p>© 2026 FLYTRIPVISA | 飞行旅行签证 . Official Document Specialists And Fly AI Robot Mini Web App.</p>
          </div>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}
