import { cookies } from "next/headers";
import { SessionUser, UserRecord } from "../types/UserRecord";
import crypto from 'crypto'
import { supabase } from "../_lib/supabase";
import { Session } from "../types/Session";
import { COOKIE_SESSION_EXPIRE_KEY, COOKIE_SESSION_KEY, SESSION_EXPIRATION_SECONDS } from "../constants/authenticationRelated";
import { cache } from "react";

export async function createUserSession(user:UserRecord): Promise<boolean>{
    const cookiesStore =  await cookies()

    const sessionId = await crypto.randomBytes(512).toString('hex').normalize()
    const expire =  new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000);

    const sessionToCreate:Session = {
        sessionId,
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
    console.log('createdSession:',createdSession)
    
    if(error || !createdSession) return false
    cookiesStore.set(COOKIE_SESSION_KEY, sessionId, {
        secure:true,
        httpOnly:true,
        sameSite:'lax',
    })

    cookiesStore.set(COOKIE_SESSION_EXPIRE_KEY, expire.getTime().toString(), {
        secure:true,
        httpOnly:true,
        sameSite:'lax',
    } )

    return true
}

export const getSessionId = cache(async() =>{
    return  (await (await cookies)()).get(COOKIE_SESSION_KEY)?.value
})

async function getUserSessionById(sessionId:string){
    try {
        const {data, error} = 
                await 
                supabase
                .from('sessions')
                .select('*')
                .eq('sessionId',sessionId)
                .single()

        if(error) return null

        return data as Session

    } catch (error) {
        return null 
    }
}

export async function getUserFromSession(){
    const sessionId = await getSessionId()
    if(!sessionId) return null

    const userSession = await getUserSessionById(sessionId)
    if(!userSession) return null

    return userSession as SessionUser
}

export async function updateUserSessionData(updatedUser:SessionUser){
    const sessionId = await getSessionId()
    const {error} =
    await supabase
    .from('sessions')
    .update({
        role:updatedUser.role,
        expire:new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000)
    })
    .eq('sessionId',sessionId)
    if(error)return error
    return null
}

async function deleteUserSessionById(sessionId:string){
    try {
        const {error} = 
                await 
                supabase
                .from('sessions')
                .delete()
                .eq('sessionId',sessionId)
        if(error) return false
        return true
    } catch (error) {
        return false 
    }
}

export async function removeUserFromSession(){
    const sessionId = await getSessionId()
    if(!sessionId) return null

    const isDeleted = await deleteUserSessionById(sessionId)
    if(!isDeleted) return null

    const cookieStore = await cookies()
    await Promise.all(
        [cookieStore.delete(COOKIE_SESSION_KEY),
        cookieStore.delete(COOKIE_SESSION_EXPIRE_KEY)]
    ) 
}

export async function getSession() : Promise<Session>{
    const sessionId = await getSessionId()
    const {data ,error} = 
    await supabase
    .from('sessions')
    .select('*')
    .eq('sessionId',sessionId)
    .single()
    if(error) throw new Error('Could not get the session object')
    return data
}

export async function updateUserSessionExpiration(){
    const sessionId = await getSessionId()
    if(!sessionId) return false
    const {error} = await supabase.from('sessions').update([{
        expire:new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000)
    }])
    .eq('sessionId',sessionId)
    if(error) return false

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_SESSION_KEY,sessionId,{
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        expires: Date.now() + SESSION_EXPIRATION_SECONDS * 1000
    })

    return true
}