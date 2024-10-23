import { NextResponse, NextRequest } from "next/server";


export function middleware(NextRequest) {
   const path = NextRequest.nextUrl.pathname

   const isPublicPath = path ==='/login' || path === '/' || path === '/signup'|| path === '/sucessful' || path === '/verifyEmail'  || path ==='/forgotpassword' || path === '/resetpassword' 

const token =  NextRequest.cookies.get('token')?.value || ''
if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', NextRequest.nextUrl))
}
if(!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', NextRequest.nextUrl))
}
}



export const config = {
    matcher:[
        '/',
       
      '/login',
        '/signup',
        '/verifyEmail',
        '/forgotpassword',
        '/resetpassword',
        

    ]
}
