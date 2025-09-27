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
import { createUserSchema } from "@/validations/auth-validation";
import { INITIAL_CREATE_USER_FORM } from "@/constants/auth-constant";
import { Form } from "@/components/ui/form";
import FormInput from "@/components/common/form-input";
import { registerUser } from "../../action";
import { toast } from "sonner";

const Register = () => {
  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: INITIAL_CREATE_USER_FORM,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const res = await registerUser(formData);

    if (res.success) {
      console.log("✅ User registered:", res.data);
      toast.success("Register Success", {
        position: "bottom-right",
      });
    } else {
      console.error("❌ Register error:", res.error);
      toast.error(res.error || "Register Failed", {
        position: "bottom-right",
      });
    }
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center mb-5">Register</CardTitle>
        <CardDescription>Register Account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-2">
            <FormInput
              form={form}
              type="text"
              name="username"
              label="Username"
              placeholder="Insert Username here"
            />
            <FormInput
              form={form}
              type="text"
              name="phone"
              label="Phone"
              placeholder="Insert Phone here"
            />
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
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Register;
