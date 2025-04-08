import { oAuthClient } from "../oAuthClient";

export function createDiscordOAuthClient(){
    const authClient = new oAuthClient({
        provider:'discord',
        urls:{
            authUrl:'https://discord.com/oauth2/authorize',
            tokenUrl:'https://discord.com/api/oauth2/token'
        },
        scopes:['identify','email'],
        client_id:process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '',
        client_secret:process.env.NEXT_PRIVATE_DISCORD_CLIENT_SECRET || '',
    })

    return authClient
}