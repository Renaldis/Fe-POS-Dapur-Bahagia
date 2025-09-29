"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchemaForm } from "@/validations/auth-validation";
import { INITIAL_LOGIN_USER_FORM } from "@/constants/auth-constant";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/form-input";
import { loginUser } from "../../action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<z.infer<typeof loginSchemaForm>>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_USER_FORM,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    const res = await loginUser(formData);

    if (res.success) {
      Cookies.set("user_profile", res.data?.token, { expires: 1 });
      setUser(res.data.user);
      toast.success("Login Success");

      router.push("/dashboard");
    } else {
      toast.error(res.error || "Login Failed");
    }
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center mb-5">Login</CardTitle>
        <CardDescription>Login Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-2">
            <FormInput
              form={form}
              type="text"
              name="email"
              label="Email"
              placeholder="Insert Email here"
            />
            <FormInput
              form={form}
              type="password"
              name="password"
              label="Password"
              placeholder="Insert Password here"
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Login;
