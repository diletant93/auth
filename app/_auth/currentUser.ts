import { cache } from "react";
import { SessionUser, UserRecord } from "../types/UserRecord";
import { getUserFromSession } from "./session";
import { getUserById } from "../services/userApi";
import { redirect } from "next/navigation";
export type getCurrentUserOptions = {
    withFullUser:boolean;
    redirectIfNotFound:boolean;
}
function _getCurrentUser(): Promise<SessionUser | null>;
function _getCurrentUser(options:{
    withFullUser:true;
    redirectIfNotFound:true;
}):Promise<UserRecord>;

function _getCurrentUser(options:{
    withFullUser?:false;
    redirectIfNotFound?:false;
}):Promise<SessionUser | null>;

function _getCurrentUser(options:{
    withFullUser?:false;
    redirectIfNotFound:true;
}):Promise<SessionUser>;

function _getCurrentUser(options:{
    withFullUser:true;
    redirectIfNotFound?:false;
}):Promise<UserRecord | null>;

async function _getCurrentUser({withFullUser = false, redirectIfNotFound = false} = {}){
    const user = await getUserFromSession()
    if(!user?.userId){
        if(redirectIfNotFound) return redirect('/sign-in')
        return null
    }
    if(withFullUser){
        const fullUser = await getUserById(user?.userId)
        if(!fullUser) throw new Error('User was not found')
        return fullUser
    }
    return user
}
export const getCurrentUser = cache(_getCurrentUser)

