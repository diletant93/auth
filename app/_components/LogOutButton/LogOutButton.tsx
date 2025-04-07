'use client'
import Button from "../Button/Button";
import { logOut } from "@/app/_actions/authActions";
import { useNoDataAction } from "@/app/_hooks/useNoDataAction";


export default function LogOutButton() {
    const handleSubmit = useNoDataAction(logOut)
  return (
    <Button onClick={()=>handleSubmit()}>
        Log out
    </Button>
  );
}
