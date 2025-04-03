import { useRouter } from "next/navigation";
import { useActionToast } from "./useActionToast";
import { AuthResponse } from "../types/authActionResponse";

export function useAuthActionHandler(action:(formData: FormData) => Promise<AuthResponse>){
    const actionToast = useActionToast()
    const router = useRouter()

   async function handleSubmit(formData: FormData) {
           const response = await action(formData)
           actionToast(response)
           if (response.status === 'success') router.push('/')
    }

    return handleSubmit
}

