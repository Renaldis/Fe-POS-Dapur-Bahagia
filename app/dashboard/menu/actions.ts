"use server";

import { MenuApi } from "@/consts/api";
import { menuSchema } from "@/validations/menu-validation";
import { cookies } from "next/headers";

export async function updateMenu(formData: FormData) {
  const validatedFields = menuSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: parseFloat(formData.get("price") as string),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    stock: parseFloat(formData.get("stock") as string),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  // Use await to get the cookies object
  const token = (await cookies()).get("user_profile")?.value;

  if (!token) {
    return {
      status: "error",
      message: "Authentication token not found.",
    };
  }

  const res = await fetch(`${MenuApi.Update}/${formData.get("id")}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(validatedFields.data),
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      status: "error",
      message: data.message || "Failed to update menu",
    };
  }

  return {
    status: "success",
  };
}

export async function deleteMenu(id: string) {
  // Use await to get the cookies object
  const token = (await cookies()).get("user_profile")?.value;

  if (!token) {
    return {
      status: "error",
      message: "Authentication token not found.",
    };
  }

  const res = await fetch(`http://localhost:3000/api/v1/menus/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    return {
      status: "error",
      message: errorData.message || "Failed to delete menu",
    };
  }

  return { status: "success" };
}
