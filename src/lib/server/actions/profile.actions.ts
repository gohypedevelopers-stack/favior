"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/dal/auth";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  await db.user.update({
    where: { id: user.id },
    data: { name, phone: phone || null },
  });

  revalidatePath("/profile");
  return { success: true };
}
