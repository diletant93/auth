'use server'
import { supabase } from "../_lib/supabase";
import { SessionUser } from "../types/UserRecord";
import { getCurrentUser } from "../_auth/currentUser";
import { updateUserSessionData } from "../_auth/session";
import { ActionResponse } from "../types/actionResponse";

export async function toggleRole():Promise<ActionResponse>{
    const sessionUser = await getCurrentUser({redirectIfNotFound:true})
    const newRole = sessionUser.role === 'user'?'admin':'user'
    const newSessionUser:SessionUser = {...sessionUser, role:newRole} 
   
    try {
        const [response1, response2] = await Promise.all([
            supabase
            .from('users')
            .update({role:newRole})
            .eq('id',sessionUser?.userId),

            updateUserSessionData(newSessionUser)
        ])

       if(response1.error || response2) return {message:'Could not toggle the role cuz of an error',status:'error'}

       return {message:`Role was toggled to ${newRole}`, status:'success'}

    } catch (error) {
        if(error instanceof Error) return {message:error.message,status:'error'}
        return {message:'Could not toggle the role',status:'error'}
    }
}
