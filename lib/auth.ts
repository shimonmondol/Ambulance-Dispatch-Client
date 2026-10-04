// lib/auth.ts (সম্পূর্ণ ফাইল)

import Cookies from "js-cookie";

export type Role = "customer" | "provider" | "admin";

export interface AuthSession {
  token: string | null;
  role: Role | null;
  name: string | null;
  email: string | null;
}

const COOKIE_NAME = "auth_session";

export const setAuthSession = (session: AuthSession) => {
  // যদি name না থাকে, তবে ইমেলের প্রথম অংশকে নাম হিসেবে ব্যবহার করি
  if (!session.name && session.email) {
    session.name = session.email.split('@')[0] || "Valued Customer";
  } else if (!session.name) {
    session.name = "User"; // একদমই কিছু না থাকলে ডিফল্ট
  }

  // কুকিতে ডাটা সেভ করি
  Cookies.set(COOKIE_NAME, JSON.stringify(session), {
    expires: 1, // ১ দিনের জন্য কুকি ভ্যালিড থাকবে
    secure: process.env.NODE_ENV === "production", // প্রোডাকশনে শুধুমাত্র HTTPS এ কাজ করবে
    sameSite: "strict",
  });
};

export const getAuthSession = (): AuthSession => {
  const sessionData = Cookies.get(COOKIE_NAME);
  try {
    return sessionData
      ? JSON.parse(sessionData)
      : { token: null, role: null, name: null, email: null };
  } catch (error) {
    // যদি কুকির ডাটা কারাপ্ট হয়, তবে এম্পটি সেশন রিটার্ন করি
    return { token: null, role: null, name: null, email: null };
  }
};

export const clearAuthSession = () => {
  Cookies.remove(COOKIE_NAME);
};