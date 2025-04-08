import { AuthProvider } from "../types/oAuthProvider";
import crypto from 'crypto'
import { cookies } from "next/headers";
import { COOKIE_CODE_VERIFIER_KEY, COOKIE_STATE_EXPIRATION_SECCONDS, COOKIE_STATE_KEY } from "../constants/authenticationRelated";
import { createDiscordOAuthClient } from "./oAuthClients/discord";
import {z} from 'zod'
type oAuthClientConstructorProps<T> = {
    provider:AuthProvider;
    urls:{
        authUrl:string;
        tokenUrl:string;
        userUrl:string;
    };
    scopes:string[];
    client_id:string;
    client_secret:string;
    user:{
        schema:z.ZodSchema;
        parser:(data:T) => {id:string; email:string; name:string;}
    };
}
export class oAuthClient<T>{
    private readonly provider:AuthProvider;
    private readonly urls:{
        authUrl:string;
        tokenUrl:string;
        userUrl:string;
    };
    private readonly scopes:string[];
    private readonly client_id:string;
    private readonly client_secret:string;
    private readonly user:{
        schema:z.ZodSchema;
        parser:(data:T) => {id:string; email:string; name:string;}
    };
    private readonly tokenSchema = z.object({
        access_token:z.string(),
        token_type:z.string(),
    })

    constructor({
        provider,
        urls,
        scopes,
        client_id,
        client_secret,
        user
    }:oAuthClientConstructorProps<T>){
        this.provider = provider
        this.urls = urls
        this.scopes = scopes
        this.client_id = client_id
        this.client_secret = client_secret
        this.user = user
    }

    private get redirectUrl(){
        return new URL(this.provider, process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL_BASE)
    }

    async getAuthUrl(){
        const [state, codeVerifier] = await Promise.all([
            createAuthState(),
            createCodeVerifier()
        ])

        const url = new URL(this.urls.authUrl)

        url.searchParams.set('scope', this.scopes.join(' '))
        url.searchParams.set('redirect_uri', this.redirectUrl.toString())
        url.searchParams.set('client_id', this.client_id)
        url.searchParams.set('response_type','code')
        
        url.searchParams.set('state',state)
        url.searchParams.set('code_challenge_method','S256')
        url.searchParams.set('code_challenge',crypto.hash('sha256',codeVerifier,'base64url'))

        return url.toString()
    }
    async fetchUser(code:string){
        const codeVerifier = await getCodeVerifier()
        if(!codeVerifier) throw new InvalidCodeVerifier()
        const {accessToken, tokenType} = await this.fetchToken(code, codeVerifier)
        const response = await fetch(this.urls.userUrl,{
            headers:{
                Authorization:`${tokenType} ${accessToken}`
            }
        })
        const rawUser = await response.json()
        const {data, success} = this.user.schema.safeParse(rawUser)
        if(!success) return new InvalidUser()
        return this.user.parser(data)

    }
    private async fetchToken(code:string, codeVerifier:string){
        try {
            const response = await fetch(this.urls.tokenUrl,{
                method:'POST',
                headers:{
                    'Content-type':'application/x-www-form-urlencoded',
                    Accept:'application/json'
                },
                body:new URLSearchParams({
                    code,
                    redirect_uri:this.redirectUrl.toString(),
                    grant_type:'authorization_code',
                    client_id:this.client_id,
                    client_secret:this.client_secret,
                    code_verifier:codeVerifier
                })
            })
            const rawData = await response.json()
            const {data, success} = this.tokenSchema.safeParse(rawData)
            if(!success) throw new InvalidToken()
            return {
                accessToken:data.access_token,
                tokenType:data.token_type
            }
        } catch (error) {
            console.error(error)
            throw error
        }
    }
}
class InvalidToken extends Error{
    constructor(){
        super('Invalid token')
    }
}
class InvalidCodeVerifier extends Error{
    constructor(){
        super('Invalid code verifier')
    }
}
class InvalidUser extends Error{
    constructor(){
        super('Invalid user')
    }
}

export function createOAuthClient(provider:AuthProvider){
    switch(provider){
        case 'github':
            return createDiscordOAuthClient()
        case 'discord':
            return createDiscordOAuthClient()
        default:
            throw new Error('The provider is not defined')
    }
}

async function createAuthState(){
    const state = crypto.randomBytes(64).toString('hex').normalize()
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_STATE_KEY, state, {
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        expires:Date.now() + COOKIE_STATE_EXPIRATION_SECCONDS * 1000
    })
    return state
}
export async function getAuthState(){
    const cookieStore = await cookies()
    const state = cookieStore.get(COOKIE_STATE_KEY)?.value
    return state
}
async function createCodeVerifier(){
    const codeVerifier = crypto.randomBytes(64).toString('hex').normalize()
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_CODE_VERIFIER_KEY, codeVerifier, {
        httpOnly:true,
        secure:true,
        sameSite:'lax',
        expires:Date.now() + COOKIE_STATE_EXPIRATION_SECCONDS * 1000
    })
    return codeVerifier
}
export async function getCodeVerifier(){
    const cookieStore = await cookies()
    const codeVerifier = cookieStore.get(COOKIE_CODE_VERIFIER_KEY)?.value
    return codeVerifier
}