"use client"
import React, { use, useEffect, useState } from 'react'
import { motion } from "motion/react"
import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

function EditRoleMobile() {

  const [roles,setRoles]=useState([
    {id:"admin",label:"Admin",icon:UserCog},
    {id:"user",label:"User",icon:User},
    {id:"deliveryBoy",label:"DeliveryBoy",icon:Bike}
  ])

  const [selectedRole,setSelectedRole]=useState("")
  const [mobile,setMobile]=useState("")
  const router = useRouter();
  const {update}=useSession()

  const handleEdit = async ()=>{
    try {
        const result = await axios.post("/api/user/edit-role-mobile",{role:selectedRole,mobile})
        console.log(result.data);

        await update({role:result.data?.user?.role})                 //update the token and session
        
        toast.success(result.data?.message)
        router.push('/');
        
    } catch (error: any) {
        // console.log(error);
        toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(()=>{
    const checkForAdmin= async ()=>{
    try {
      const result=await axios.get("/api/check-for-admin")
      // console.log(result.data)
      if(result.data?.adminExist){
        setRoles((prevRoles)=>prevRoles.filter((r)=>r.id!=="admin"))                       //if admin exist then remove admin from roles options
      }
    } catch (error) {
      console.log(error)
    }
  }
  checkForAdmin()
  },[])

  

  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6 w-full'>
        <motion.h1 
          initial={{opacity:0, y:-20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.6}}
          className='text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8'>Complete Your Profile
        </motion.h1>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
          {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.div key={role.id}
              whileTap={{scale:0.9}}
              onClick={()=>setSelectedRole(role.id)}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all ${
                isSelected
                ? "border-green-600 bg-green-100 shadow-lg"
                : "border-gray-300 bg-white hover:border-green-400"
              }`}
            >
            <Icon />

            <span>
              {role.label}
            </span>
            </motion.div>
          );
          })}
        </div>

        <motion.div
          initial={{opacity:0, y:-20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.6,delay:0.5}}
          className='flex flex-col mt-10 text-center'
        >
          <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">Enter Your Mobile No.</label>
          <input
          type="tel"
          id="mobile"
          placeholder="eg. 0000000000"
          onChange={(e) =>setMobile(e.target.value)}
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          />   

        </motion.div>
        <motion.button
          initial={{opacity:0, y:20}}
          animate={{opacity:1, y:0}}
          transition={{duration: 0.7}}
          disabled={mobile.length!==10 || !selectedRole}
          onClick={handleEdit}
          className={`infile-flex items-center gap-2 mt-8 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 ${
            selectedRole && mobile.length===10
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Go to Home
          <ArrowRight className='w-5 h-5 inline ml-2'/>
        </motion.button>

    </div>
  )
}

export default EditRoleMobile




// <-------------------------- Notes ----------------------------->
// Client Component → useRouter()
// Server Component → redirect()

//this is not necessary but generally follow