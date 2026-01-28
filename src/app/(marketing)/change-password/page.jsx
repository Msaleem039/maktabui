"use client"
import ChangePasswordContent from "@/components/dashboard/change-password/ChangePasswordContent";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordContent />
    </Suspense>
  );
}