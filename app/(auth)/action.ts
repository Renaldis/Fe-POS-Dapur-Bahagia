"use server";

import { RouteApi } from "@/consts/api";
import {
  createUserSchema,
  loginSchemaForm,
} from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";

export async function registerUser(formData: FormData) {
  const validatedFields = createUserSchema.safeParse({
    username: formData.get("username"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  try {
    const res = await fetch(RouteApi.Register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields),
    });

    if (!res.ok) {
      let errorMessage = `Failed to register user: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    const data = await res.json();

    revalidatePath("/");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function loginUser(formData: FormData) {
  const validatedFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
      },
    };
  }

  try {
    const res = await fetch(RouteApi.Login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    });

    if (!res.ok) {
      let errorMessage = `Failed to Login user: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (_) {}
      throw new Error(errorMessage);
    }

    const data = await res.json();

    revalidatePath("/");

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
