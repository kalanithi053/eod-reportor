"use client";
import templateService from "@/service/template.service";
import { useUserStore } from "@/store/useAuthStore";
import { useState } from "react";
import { useAlert } from "../ui/Alert";
import { ConfirmDialog } from "../ui/ConfirmDialog";
import {
  ActionButton,
  FieldRow,
  SettingsCard,
  StatusPill,
} from "../ui/SettingsCard";

export function OAuthTab() {
  const { user, setUser } = useUserStore();
  const triggerZohoOAuth = async () => {
    const res = await templateService.triggerZohoOAuth();
    window.location.href = res?.data;
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const { showAlert, AlertContainer } = useAlert();
  const revokeZohoOAuth = async () => {
    const res = await templateService.revokeZohoOAuth();
    setUser(res.data);
    showAlert({ type: "warning", message: "Zoho access revoked." });
  };
  // TODO tab=oauth&status=success&Module=zoho check on the search param and trigger toast for oauth success for zoho
  return (
    <div>
      <ConfirmDialog
        open={showConfirm}
        variant={!user?.configuration?.validatedZoho ? "info" : "danger"}
        title={
          !user?.configuration?.validatedZoho
            ? "Connect with Zoho Projects"
            : "Revoke Access"
        }
        description={
          !user?.configuration?.validatedZoho
            ? "Link your Zoho Projects account with EOD Reporter to sync project information for daily reporting."
            : "Revoke access with your Zoho Projects account"
        }
        confirmLabel={
          !user?.configuration?.validatedZoho ? "Connect" : "Revoke"
        }
        cancelLabel={
          !user?.configuration?.validatedZoho
            ? "Stay unconnected"
            : "Stay connected"
        }
        onConfirm={
          !user?.configuration?.validatedZoho
            ? triggerZohoOAuth
            : revokeZohoOAuth
        }
        onCancel={() => setShowConfirm(false)}
      />
      <AlertContainer />
      <SettingsCard title="Google OAuth">
        <FieldRow label="Google account" hint={user?.email ?? "Not signed in"}>
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Gmail API" hint="Send EOD mails on your behalf">
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Google Sheets API" hint="Read task rows and hours">
          <StatusPill connected={!!user?.configuration?.validatedGoogle} />
        </FieldRow>
        <FieldRow label="Zoho OAuth" hint="Tasks · logs · status sync">
          <StatusPill connected={!!user?.configuration?.validatedZoho} />
          {!user?.configuration?.validatedZoho ? (
            <ActionButton
              variant="primary"
              onClick={() => setShowConfirm(true)}
            >
              Connect
            </ActionButton>
          ) : (
            <ActionButton variant="danger" onClick={() => setShowConfirm(true)}>
              Revoke
            </ActionButton>
          )}
        </FieldRow>
      </SettingsCard>
    </div>
  );
}
