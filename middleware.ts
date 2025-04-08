import { NextRequest, NextResponse } from "next/server";
import { COOKIE_SESSION_EXPIRE_KEY, COOKIE_SESSION_KEY } from "./app/constants/authenticationRelated";
import { deleteSessionById } from "./app/services/sessionApi";
import { ADMIN_ROUTES, PRIVATE_ROUTES} from "./app/constants/routesRelated";
import { getUserFromSession, updateUserSessionExpiration } from "./app/_auth/session";

export async function middleware(request:NextRequest){
    
    if (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/sign-up') {
        return NextResponse.next();
    }
   
    const sessionResult = await middlewareSession(request)
    if(sessionResult) return sessionResult

    const routesResult = await middlewareRoutes(request)
    if(routesResult) return routesResult

    const isUpdatedSession = await updateUserSessionExpiration()
    if(!isUpdatedSession) return NextResponse.redirect(new URL('/sign-in',request.url))
    
        
    return NextResponse.next()
}

async function middlewareSession(request:NextRequest){
    const cookies = request.cookies
    const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
    const sessionExpire = cookies.get(COOKIE_SESSION_EXPIRE_KEY)?.value
    console.log('inside the sesisonMiddleware')
    if(!sessionId || !sessionExpire) return NextResponse.redirect(new URL('/sign-in',request.url))
    console.log('after being cheked if are not nulls')
    const expiryTime = Number(sessionExpire)

    if(Date.now() > expiryTime){
        console.log('inside the expired session')
        const res = NextResponse.redirect(new URL('/sign-in',request.url))
        res.cookies.delete(COOKIE_SESSION_KEY)
        res.cookies.delete(COOKIE_SESSION_EXPIRE_KEY)
        await deleteSessionById(sessionId)
        return res;
    }
    console.log('after being checked if not expired')
    return null
}

async function middlewareRoutes(request:NextRequest){
    
    if (ADMIN_ROUTES.includes(request.nextUrl.pathname)) {
        const user = await getUserFromSession();
        if (!user) return NextResponse.redirect(new URL('/sign-in', request.url));
        if (user.role !== 'admin') return NextResponse.redirect(new URL('/', request.url));
    }
    
    if (PRIVATE_ROUTES.includes(request.nextUrl.pathname)) {
        const user = await getUserFromSession();
        if (!user) return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    
    return null;
}

export const config = {
    matcher:['/','/account','/admin']
}