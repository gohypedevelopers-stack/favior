"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/dal/auth";
import { revalidatePath } from "next/cache";

export async function createAddress(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const address1 = formData.get("address1") as string;
  const address2 = formData.get("address2") as string | null;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const zip = formData.get("zip") as string;
  const country = formData.get("country") as string || "India";
  const isDefault = formData.get("isDefault") === "on";

  if (!firstName || !lastName || !address1 || !city || !state || !zip) {
    return { error: "Please fill in all required fields." };
  }

  if (isDefault) {
    await db.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false }
    });
  }

  await db.address.create({
    data: {
      userId: user.id,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zip,
      country,
      isDefault
    }
  });

  revalidatePath("/profile");
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.address.delete({
    where: { id: addressId, userId: user.id }
  });

  revalidatePath("/profile");
  return { success: true };
}
