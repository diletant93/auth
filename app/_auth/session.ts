import { cookies } from "next/headers";
import { UserRecord } from "../types/UserRecord";
import crypto from 'crypto'
import { supabase } from "../_lib/supabase";
import { Session } from "../types/Session";

const SESSION_EXPIRATION_SECONDS = 60*60*24*7
const COOKIE_SESSION_KEY = 'session-id'

export async function createUserSession(user:UserRecord): Promise<boolean>{
    const cookiesStore =  await cookies()

    const sessionId = await crypto.randomBytes(512).toString('hex').normalize()
    const expire =  new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000);

    const sessionToCreate:Session = {
        id:sessionId,
        userId:user.id,
        role:user.role || 'user',
        expire
    }

    const {data:createdSession, error} =
    await 
    supabase
    .from('sessions')
    .insert([sessionToCreate])
    .select()
    .single()
    
    if(error || !createdSession) return false
 
    cookiesStore.set(COOKIE_SESSION_KEY, sessionId, {
        secure:true,
        httpOnly:true,
        sameSite:'lax',
        expires:Date.now() + SESSION_EXPIRATION_SECONDS * 1000
    })

    return true
}