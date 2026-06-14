
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './auth';

 
export async function proxy(req: NextRequest) {
//   console.log(req.nextUrl);
  const {pathname}=req.nextUrl
  const publicRoutes=[
    "/login",
    "/register",
    "/api/auth",
    "/favicon.ico"
  ]

  if(publicRoutes.some((path)=>pathname.startsWith(path))){
    return NextResponse.next();              
  } 
  
  const session=await auth()
  // console.log(session);
  
  if(!session){
    const loginUrl=new URL("/login",req.url)
    loginUrl.searchParams.set("callbackUrl",req.url)
    return NextResponse.redirect(loginUrl)                 
  }


  if(pathname.startsWith('/user') && session.user?.role !== "user") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));        
  }

  if(pathname.startsWith('/admin') && session.user?.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));        
  }

  if(pathname.startsWith('/delivery') && session.user?.role !== "deliveryBoy") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));        
  }

  return NextResponse.next();  
  
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)"          
]          
}

// or 

// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

 
// export async function proxy(req: NextRequest) {
// //   console.log(req.nextUrl);
//   const {pathname}=req.nextUrl
//   const publicRoutes=[
//     "/login",
//     "/register",
//     "/api/auth",
//     "/favicon.ico"
//   ]

//   if(publicRoutes.some((path)=>pathname.startsWith(path))){
//     return NextResponse.next();              
//   } 
  
//   const token=await getToken({req,secret:process.env.AUTH_SECRET})
//   console.log(token);
  
//   if(!token){
//     const loginUrl=new URL("/login",req.url)
//     loginUrl.searchParams.set("callbackUrl",req.url)
//     return NextResponse.redirect(loginUrl)                 
//   }


//   if(pathname.startsWith('/user') && token.role !== "user") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));        
//   }

//   if(pathname.startsWith('/admin') && token.role !== "admin") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));        
//   }

//   if(pathname.startsWith('/delivery') && token.role !== "deliveryBoy") {
//     return NextResponse.redirect(new URL("/unauthorized", req.url));        
//   }

//   return NextResponse.next();  
  
// }


// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|login|register|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)"          
// ]          
// }




// <---------------------------- Notes ---------------------------->
// 🧠 Line-by-line explanation

// 🔹 Import section
// import { getToken } from 'next-auth/jwt';

// 👉 From **NextAuth

// Used to read JWT token from cookies
// Helps check if user is logged in
// import { NextResponse } from 'next/server'

// 👉 Used to:

// Continue request → next()
// Redirect → redirect()
// import type { NextRequest } from 'next/server'

// 👉 TypeScript type for request object

// 🔹 Middleware function
// export async function proxy(req: NextRequest)

// 👉 This is your middleware (proxy) function

// Runs before every request
// req = incoming request

// 🔹 Get current path
// const { pathname } = req.nextUrl

// 👉 Extracts URL path
// Example:

// /dashboard
// /login
// /api/user

// 🔹 Public routes
// const publicRoutes = [
//   "/login",
//   "/register",
//   "/api/auth",
//   "/favicon.ico"
// ]

// 👉 These routes are:

// Accessible without login ✅

// 🔹 Check public route
// if (publicRoutes.some(path => pathname.startsWith(path)))

// 👉 Meaning:

// If current path starts with any public route

// Example:

// /login → true
// /api/auth/signin → true
// return NextResponse.next();

// 👉 Allow request to continue
// (No auth check needed)

// 🔐 Authentication check
// const token = await getToken({ req, secret: process.env.     AUTH_SECRET })

// 👉 Reads JWT token from cookies

// Logged in → token exists ✅
// Not logged → null ❌

// 🔹 If user NOT logged in
// if (!token)

// 👉 User is unauthenticated

// 🔹 Create login URL
// const loginUrl = new URL("/login", req.url)

// 👉 Creates full login URL
// Example:

// http://localhost:3000/login

// 🔹 Add callback URL
// loginUrl.searchParams.set("callbackUrl", req.url)

// 👉 Adds:

// /login?callbackUrl=/dashboard

// 👉 So after login:

// User returns to original page

// 🔹 Redirect
// return NextResponse.redirect(loginUrl)

// 👉 Sends user to login page

// 🔹 If user is logged in
// return NextResponse.next();

// 👉 Allow access to protected route

// 🔹 Config (VERY IMPORTANT)
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|login|register|.*\\.(?:png|jpg|jpeg|svg|gif|webp)$).*)"           
//   ]
// }

// 👉 Controls where middleware runs

// What it means:
// Run on all routes EXCEPT:
// API routes
// _next/static → JS files
// _next/image → images
// favicon.ico

// 👉 Prevents:

// CSS/JS breaking ❌

// 🔄 Full Flow
// Request → Proxy Middleware
//         ↓
// Is public route? → YES → allow
//         ↓
// NO
//         ↓
// Check token
//         ↓
// Token exists → allow
// Token missing → redirect to login


// 🧠 Interview answer (perfect)
// I use middleware (proxy) in Next.js to protect routes. First, I allow public routes. Then I check authentication using getToken from NextAuth. If no token is found, I redirect the user to login with a callback URL. Otherwise, I allow the request.
