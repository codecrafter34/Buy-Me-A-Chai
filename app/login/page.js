"use client"
//  ye page wala login wala page hai

import Image from "next/image";
import Link from "next/link";
import React,{useEffect, useState, Suspense} from 'react'
import tea from "../tea.gif"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import { setUserRole } from '@/actions/useractions'
const LoginContent = () => {
    const { data: session, update } = useSession();
    const router=useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get("mode")
    const redirect = searchParams.get("redirect")
    const isCreatorFlow = mode === "creator-new" || mode === "creator-login"
    const [activeTab, setActiveTab] = useState(mode === "user" ? "user" : "creator")
    const [authMode, setAuthMode] = useState(mode === "creator-new" ? "register" : "login")
    const [form, setForm] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        role: "user",
    })
    const [registerStatus, setRegisterStatus] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        const redirectAfterLogin = async () => {
            if (!session?.user?.name) {
                return
            }

            let role = session.user.role;
            const intendedRole = localStorage.getItem("intendedRole");
            const postLoginRedirect = localStorage.getItem("postLoginRedirect");

            if (intendedRole === "creator" && role !== "creator") {
                await setUserRole(session.user.name, "creator");
                await update();
                role = "creator";
            }

            localStorage.removeItem("intendedRole");
            localStorage.removeItem("postLoginRedirect");

            if (role === 'creator') {
                router.push('/dashboard')
            } else {
                if (redirect) {
                    router.push(redirect)
                } else if (postLoginRedirect) {
                    router.push(postLoginRedirect)
                } else {
                    router.push('/')
                }
            }
        }

        redirectAfterLogin()
    }, [session, router, update, redirect])

    useEffect(() => {
        if (mode === "user") {
            setActiveTab("user")
            setAuthMode("login")
        }
        if (mode === "creator-new") {
            setActiveTab("creator")
            setAuthMode("register")
        }
        if (mode === "creator-login") {
            setActiveTab("creator")
            setAuthMode("login")
        }
    }, [mode])

    const handleInputChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleOAuthLogin = (provider) => {
        localStorage.setItem("intendedRole", activeTab);
        if (redirect) {
            localStorage.setItem("postLoginRedirect", redirect);
        }
        signIn(provider);
    }

    const handleRegister = async () => {
        setRegisterStatus("")
        if (!form.email || !form.username || !form.password) {
            setRegisterStatus("Email, username, and password are required")
            return
        }

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                username: form.username,
                password: form.password,
                role: activeTab === "creator" ? "creator" : "user",
            }),
        })

        const data = await res.json()
        if (!res.ok || !data?.success) {
            setRegisterStatus(data?.message || "Registration failed")
            return
        }

        // Auto login after successful registration
        const loginRes = await signIn("credentials", {
            redirect: false,
            username: form.username,
            password: form.password,
        })

        if (!loginRes?.ok) {
            setRegisterStatus("Registered successfully. Please sign in.")
            setAuthMode("login")
        }
    }

    const handleCredentialsLogin = async () => {
        setLoginStatus("")
        if (!form.username || !form.password) {
            setLoginStatus("Username and password are required")
            return
        }

        const res = await signIn("credentials", {
            redirect: false,
            username: form.username,
            password: form.password,
        })

        if (!res?.ok) {
            setLoginStatus("Invalid credentials")
            return
        }
    }
  return (
    <div className='text-white py-14 container mx-auto flex flex-col items-center min-h-screen font-sans'>
      
      {/* Logo */}
      <div className="mb-6">
        <Image src={tea} alt="Logo" width={60} />
      </div>
      
      {/* Title */}
      <h1 className='text-center font-bold text-2xl mb-8'>
        Log in or sign up
      </h1>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {/* Social Buttons */}
        <button onClick={()=>{handleOAuthLogin("google")}} className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-md hover:bg-gray-200 transition">
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <button onClick={()=>{handleOAuthLogin("github")}} className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-md hover:bg-gray-200 transition">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>Continue with Github</span>
        </button>

        {/* OR Separator */}
        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Tabs for Roles */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-[#15171e] rounded-md p-1 border border-gray-800">
            <button type="button" onClick={() => setActiveTab("user")} className={`flex-1 py-2 rounded text-sm font-medium transition ${activeTab === "user" ? "bg-lime-400 text-black shadow-sm" : "text-gray-400 hover:text-white"}`}>
              User
            </button>
            <button type="button" onClick={() => setActiveTab("creator")} className={`flex-1 py-2 rounded text-sm font-medium transition ${activeTab === "creator" ? "bg-lime-400 text-black shadow-sm" : "text-gray-400 hover:text-white"}`}>
              Creator
            </button>
          </div>
        </div>

        {/* Form Fields */}
        {authMode === "login" ? (
          <div className="flex flex-col gap-3 mt-1">
              <input name="username" value={form.username} onChange={handleInputChange} placeholder="Username" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition" />
              <div className="relative w-full">
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                  </button>
              </div>
              <button type="button" onClick={handleCredentialsLogin} className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-md mt-1 transition">Continue</button>
              {loginStatus && <div className="text-xs text-red-400 text-center mt-1">{loginStatus}</div>}
              
              <div className="text-center mt-4 text-sm text-gray-400">
                  New here? <span onClick={() => setAuthMode("register")} className="text-lime-400 cursor-pointer hover:underline">Register</span>
              </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-1">
              <input name="name" value={form.name} onChange={handleInputChange} placeholder="Full name" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition" />
              <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition" />
              <input name="username" value={form.username} onChange={handleInputChange} placeholder="Username" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition" />
              <div className="relative w-full">
                  <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-[#222222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-lime-400 placeholder-gray-500 transition pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                      {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                  </button>
              </div>
              <button type="button" onClick={handleRegister} className="w-full bg-lime-400 hover:bg-lime-500 text-black font-bold py-3 rounded-md mt-1 transition">Register</button>
              {registerStatus && <div className="text-xs text-red-400 text-center mt-1">{registerStatus}</div>}

              <div className="text-center mt-4 text-sm text-gray-400">
                  Already have an account? <span onClick={() => setAuthMode("login")} className="text-lime-400 cursor-pointer hover:underline">Already sign in</span>
              </div>
          </div>
        )}

       

      </div>
    </div>
  )
}

const Login = () => {
  return (
    <Suspense fallback={<div className="text-white text-center mt-20">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}

export default Login
