"use client"
import OTPVerification from "@/components/dashboard/verify-otp/OTPVerification";
import { Suspense } from "react";

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OTPVerification />
    </Suspense>
  );
}