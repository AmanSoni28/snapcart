"use client"
import RegisterForm from '@/component/registerForm'
import Welcome from '@/component/welcome'
import React, { useState } from 'react'

function Register() {
const [step,setStep]=useState(1)
  return (
    <div>
      {step === 1 ? <Welcome nextStep={setStep} /> : <RegisterForm previousStep={setStep} />}
    </div>
  )
}

export default Register