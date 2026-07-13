"use client";
import { OAuthTab } from "@/components/settings/OauthTab";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { ProjectsTab } from "@/components/settings/ProjectsTab";
import { SheetTab } from "@/components/settings/SheetTab";
import { useUserStore } from "@/store/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") ?? "oauth";
  const { user } = useUserStore();
  const setTab = (tab: string) => {
    router.push(`/settings?tab=${tab}`, { scroll: false });
  };

  const isSheetDisabled = user?.configuration?.cronOption === "EOD";

  useEffect(() => {
    if (activeTab === "sheet" && user?.configuration?.cronOption === "EOD") {
      router.replace("/settings?tab=oauth");
    }
  }, [activeTab, user, router]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-100">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Manage OAuth connections, sheet config, and project mappings
        </p>
      </div>

      <div className="flex-1 min-w-0">
        {activeTab === "oauth" && <OAuthTab />}
        {activeTab === "sheet" && !isSheetDisabled && <SheetTab />}
        {activeTab === "projects" && <ProjectsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
