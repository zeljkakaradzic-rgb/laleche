"use server";

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { setSessionCookie } from "@/lib/auth";

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(email: string, password: string): Promise<LoginResult> {
  const user = await db.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) return { ok: false, error: "Pogrešan email ili lozinka." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Pogrešan email ili lozinka." };

  await setSessionCookie(user.id);
  return { ok: true };
}
