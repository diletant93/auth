import { useRouter } from "next/navigation"
import { useActionToast } from "./useActionToast"
import { AuthResponse } from "../types/authActionResponse"

export function useNoDataAction(action:()=>Promise<AuthResponse>){
    const actionToast = useActionToast()
    const router = useRouter()

   async function handleSubmit() {
           const response = await action()
           actionToast(response)
           if (response.status === 'success') router.push('/')
    }

    return handleSubmit
}