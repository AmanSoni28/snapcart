"use client"
import React from 'react'
import { motion } from "motion/react"
import { ArrowBigRight, Bike, MonitorSmartphone, ShoppingBasket } from 'lucide-react'

type propType = {
  nextStep: (s:number) => void
}

function Welcome({ nextStep }: propType) {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center p-6 '>
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='flex items-center gap-3'
        >
            <ShoppingBasket className='w-10 h-10 text-green-600'/>
            <h1 className='text-4xl md:text-5xl font-extrabold text-green-700'>SnapCart</h1>
        </motion.div>
        <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-4 text-gray-700 text-lg md:text-xl max-w-lg'
        >
          Your 10-minute grocery delivery app. Freshness at your doorstep, faster than ever!
        </motion.p>
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='flex items-center justify-center gap-10 mt-10'
        >
            <ShoppingBasket className='w-24 h-24 md:h-32 text-green-600 drop-shadow-md'/>
            <Bike className='w-24 h-24 md:h-32 text-orange-500 drop-shadow-md'/>
        </motion.div>
        <motion.button
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className='mt-10 bg-green-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-700 transition-colors'
            onClick={() => nextStep(2)}
        >
          Get Started
          <ArrowBigRight className='w-5 h-5 ml-2 inline-block'/>
        </motion.button>
    </div>
  )
}

export default Welcome
