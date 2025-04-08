'use server'
import { redirect } from "next/navigation"
import { AuthProvider } from "../types/oAuthProvider"
import { createOAuthClient } from "../_auth/oAuthClient"

export async function oAuthSignIn(provider:AuthProvider){
    const oAuthClient = createOAuthClient(provider)
    const authUrl = await oAuthClient.getAuthUrl()
    redirect(authUrl)
}