import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { type ReactNode } from "react";

type DialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

export const BaseDialog = ({
  open,
  onOpenChange,
  trigger,
  children,
  contentClassName,
}: DialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className={contentClassName}>{children}</DialogContent>
    </Dialog>
  );
};
