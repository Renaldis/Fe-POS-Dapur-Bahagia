import DialogDelete from "@/components/common/dialog-delete";
import { startTransition, useState } from "react";

import { Menu } from "@/validations/menu-validation";
import { toast } from "sonner";
import { deleteMenu } from "../actions";

export default function DialogDeleteMenu({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  open: boolean;
  refetch: () => void;
  currentData?: Menu;
  handleChangeAction: (open: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    if (!currentData?.id) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        const res = await deleteMenu(currentData.id);
        if (res.status === "success") {
          toast.success("Menu deleted successfully");
          refetch();
          handleChangeAction(false);
        } else {
          toast.error(res.message || "Failed to delete menu");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Failed to delete menu");
        }
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isLoading}
      onSubmit={onSubmit}
      title="Menu"
    />
  );
}
