"use strict";
"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { siGithub } from "simple-icons";

import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { users } from "@/data/users";
import { cn } from "@/lib/utils";

import { AccountSwitcher } from "./_components/sidebar/account-switcher";
import { LayoutControls } from "./_components/sidebar/layout-controls";
import { SearchDialog } from "./_components/sidebar/search-dialog";
import { ThemeSwitcher } from "./_components/sidebar/theme-switcher";

// যেহেতু এটি Client Component-এ রুপান্তর করা হয়েছে, সার্ভার একশন বা কুকিজ ক্লায়েন্ট সাইড ইফেক্ট ও ডাইনামিকালি হ্যান্ডেল হবে।
export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const [defaultOpen, setDefaultOpen] = useState(true);
  const [variant, setVariant] = useState<any>("sidebar");
  const [collapsible, setCollapsible] = useState<any>("icon");
  
  // হেডার হাইড/শো করার জন্য স্টেট লজিক
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // কুকি এবং প্রেফারেন্স রিড করার মক সল্যুশন ক্লায়েন্ট সাইডের জন্য
    if (typeof window !== "undefined") {
      const isClosed = document.cookie.includes("sidebar_state=false");
      setDefaultOpen(!isClosed);
    }

    const controlHeader = () => {
      if (typeof window !== "undefined") {
        // ১০০ পিক্সেলের বেশি স্ক্রল করলে এবং নিচে স্ক্রল করলে হাইড হবে
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setShowHeader(false); 
        } else {
          setShowHeader(true); // উপরে স্ক্রল করলেই সাথে সাথে ফিরে আসবে
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

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
          // রিকোয়ারমেন্ট অনুযায়ী চারপাশের সমস্ত অপ্রয়োজনীয় বর্ডার এখান থেকে রিমুভ করা হয়েছে
          "[--dashboard-header-height:--spacing(12)]",
          "min-w-0 overflow-x-clip",
        )}
      >
        <header
          className={cn(
            "flex h-12 shrink-0 items-center gap-2 transition-transform duration-300 ease-in
