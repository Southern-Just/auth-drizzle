"use server";

import { db } from "@/database/db";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function signUpUser({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const existing = await db.select().from(users).where(eq(users.email, email));
  if (existing.length > 0) return { error: "User already exists" };

  await db.insert(users).values({ email, password, firstName, lastName });
  return { success: true };
}

export async function signInUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const found = await db.select().from(users).where(eq(users.email, email));
  if (found.length === 0) return { error: "No user found" };

  const user = found[0];
  if (user.password !== password) return { error: "Invalid password" };

  return { success: true, user };
}
