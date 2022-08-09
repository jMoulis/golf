import { useCallback, useState } from "react";

export const useToggle = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleToggle = useCallback(() => setOpen((prev) => !prev), []);

  return {
    open,
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: handleToggle
  };
};
