"use client"
import { ArrowLeft, Eye, EyeOff, Leaf, Lock, LogIn, Mail, User } from "lucide-react";
import React, { useState } from "react";
import { motion } from "motion/react"
import Image from "next/image";
import googleImg from '@/assets/google.png'
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

function Login() {

  const [email,setEmail]= useState("")  
  const [password,setPassword]= useState("")  
  const [showPassword,setShowPassword]= useState(false)  
  const [loading,setLoading]= useState(false)
  const router = useRouter()
  const session=useSession()

  // console.log(session?.data)
  const handleLogin = async (e:React.FormEvent)=>{
    e.preventDefault();
    setLoading(true);        
    try {
      const result = await signIn("credentials",{email,password,redirect: false,});
      
      // Login failed
      if (result?.error) {
        toast.error("Invalid Email Or Password");
        return;
      }

      // Login success
      toast.success("Login successful");

      router.push("/");

      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
  
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      
      
      <motion.h1
        initial={{opacity:0, y:-10}}
        animate={{opacity:1, y:0}}
        transition={{duration: 0.6}}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
         Welcome back
      </motion.h1>
      <p className="text-gray-600 mb-6 flex items-center font-semibold">
        Login To Snapcart <Leaf className="w-5 h-5 text-green-600"/>
      </p>
      <motion.div className="w-full max-w-md bg-green-50 p-6 rounded-lg shadow-md"
        initial={{opacity:0, y:10}}
        animate={{opacity:1, y:0}}
        transition={{duration: 0.6, delay: 0.3}}>
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400"/>
            <input
              type="email"
              id="email"
              onChange={(e)=>setEmail(e.target.value)}
              className="mt-1 block w-full border p-2 pl-10 border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-green-500 "
              placeholder="john@example.com"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400"/>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              onChange={(e)=>setPassword(e.target.value)}
              className="mt-1 block w-full border p-2 pl-10 border-gray-300 rounded-md shadow-sm outline-none focus:ring-1 focus:ring-green-500"
              placeholder="••••••••"
            />
            {
                showPassword ? <EyeOff className="absolute right-3 top-9 w-5 h-5 text-gray-400 cursor-pointer" onClick={()=>setShowPassword(false)}/> : <Eye className="absolute right-3 top-9 w-5 h-5 text-gray-400 cursor-pointer" onClick={()=>setShowPassword(true)}/>
            }
          </div>
        </div>

        {
          (() => {const formValidation = email && password;

          return (
           <button
            className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
            formValidation
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            } mt-6`}
            disabled={!formValidation || loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Log In"}
           </button>
          );
          })()
        }

        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
            <span className="flex-1 h-px bg-gray-300"></span>
              OR
            <span className="flex-1 h-px bg-gray-300"></span>
        </div>

      </form>

      <button className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
      onClick={()=>signIn("google",{ callbackUrl: "/"})}>
            <Image src={googleImg}  width={20} height={20} alt="googleImage"/>
            Continue with google
        </button>

        <p className="text-gray-600 mt-4 text-sm flex items-center justify-center gap-1">
          Want To Create an account ? <LogIn className="w-4 h-4 cursor-pointer" onClick={()=>router.push('/register')}/> <span className="text-green-600 cursor-pointer" onClick={()=>router.push('/register')} >register</span>
        </p>

      </motion.div>

    </div>
  );
}

export default Login;






// <---------------------------------Notes---------------------------->
// for handling next-auth or auth.js error we use result.error 
// next-auth does not send exact message from backend 
// The reason is security
// In Auth.js/NextAuth credentials login, backend messages are intentionally hidden from frontend.
// So Auth.js hides detailed backend auth errors and instead returns generic errors like:
// CredentialsSignin
// Configuration
// AccessDenied

// So for error we write manual message in frontend instead of showing backend message.  

// <--------------------------------------------------------------------->
//Note this is Auth.js not axios so-

// if use
// try {
//   const result =
//     await signIn("credentials",{email,password,redirect: false});

//   router.push("/");

// } catch (error) {
//   console.log(error);
// }

// What happens with wrong email/password?

// signIn() returns something like:

// {
//   ok: false,
//   error:
//     "CredentialsSignin"
// }

// But you are ignoring result.error.

// So this still runs:

// router.push("/")

// which makes it look like login succeeded.

// Correct behavior

// Use:

// try {
//   const result =
//     await signIn(
//       "credentials",{email,password,redirect: false});

//     if (result?.error) {
//       console.log(result.error);
//       return;
//     }

//     router.push("/");

// } catch (error) {
//   console.log(error);
// }

// Now:

// Wrong email/password
// No login
// No redirect
// Correct email/password
// Login success
// Redirect to "/"  
