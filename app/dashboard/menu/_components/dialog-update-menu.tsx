"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import FormMenu from "./form-menu";
import { Dialog } from "@radix-ui/react-dialog";
import { Menu, MenuForm, menuFormSchema } from "@/validations/menu-validation";
import { updateMenu } from "../actions";

export default function DialogUpdateMenu({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: Menu;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const form = useForm<MenuForm>({
    resolver: zodResolver(menuFormSchema),
  });

  const onSubmit = form.handleSubmit(async (data) => {
    if (!currentData?.id) {
      toast.error("Menu ID tidak tersedia");
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append("id", currentData.id);

    const res = await updateMenu(formData);

    if (res.status === "success") {
      toast.success("Update Success");
      refetch();
      handleChangeAction?.(false);
    } else {
      toast.error(res.status || "Update Failed");
    }
  });

  useEffect(() => {
    if (currentData) {
      form.setValue("name", currentData.name);
      form.setValue("description", currentData.description);
      form.setValue("price", currentData.price.toString());
      form.setValue("category", currentData.category);
      form.setValue("stock", currentData.stock.toString());
      form.setValue("imageUrl", currentData.imageUrl.toString());
    }
  }, [currentData, form]);

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormMenu
        form={form}
        onSubmit={onSubmit}
        isLoading={form.formState.isSubmitting}
        type="Update"
      />
    </Dialog>
  );
}
