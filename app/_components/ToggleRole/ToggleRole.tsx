'use client'
import { useNoDataAction } from "@/app/_hooks/useNoDataAction";
import Button from "../Button/Button";
import { toggleRole } from "@/app/_actions/roleActions";
import { useTransition } from "react";

export default function ToggleRole() {
  const handleToggle = useNoDataAction(toggleRole)
  const [isPending, startTransition] = useTransition()
  return (
    <Button onClick={()=>startTransition(handleToggle)} disabled={isPending}>{isPending?'Toggling...':'Toggle role'}</Button>
  );
}
