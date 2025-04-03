'use client'
import { useAuthActionHandler } from "@/app/_hooks/useAuthActionHandler";
import Button from "../Button/Button";
import { logOut } from "@/app/_actions/authActions";
import { useAuthLogoutHandler } from "@/app/_hooks/useAuthLogoutHandler";


export default function LogOutButton() {
    const handleSubmit = useAuthLogoutHandler(logOut)
  return (
    <Button onClick={()=>handleSubmit()}>
        Log out
    </Button>
  );
}
