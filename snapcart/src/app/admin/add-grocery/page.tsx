"use client";
import { ArrowLeft, Loader2, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";


const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "g", "liter", "ml", "piece", "pack"];

function AddGrocery() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<File | null>(null);
  const [loading,setLoading]= useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length == 0) return;
    const file = files[0];
    setBackImg(file);
    setFrontImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name",name)
      formData.append("category",category)
      formData.append("price",price)
      formData.append("unit",unit)
      if(backImg){
        formData.append("image",backImg)
      }

      const result = await axios.post('/api/admin/add-grocery', formData)
      // console.log(result.data);

      toast.success(result.data?.message)
                                
      setName("")
      setCategory("")
      setPrice("")
      setUnit("")
      setBackImg(null)
      setFrontImg(null)
    } catch (error : any) {
      // console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally{
      setLoading(false)
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-green-50 to-white px-16 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-50 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:flex "> Back to home </span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-green-600 w-8 h-8" />
            <h1> Add Grocery </h1>
          </div>

          <p className="text-gray-500 text-sm mt-2 text-center">
            {" "}
            Fill out the details below to add a new grocery item.{" "}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="eg: sweets, milk"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category
                <span className="text-red-500">*</span>
              </label>

              <select
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                <option value="">Select Category</option>

                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {" "}
                    {cat}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Unit
                <span className="text-red-500">*</span>
              </label>

              <select
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
              >
                <option value="">Select Unit</option>

                {units.map((unit, index) => (
                  <option key={index} value={unit}>
                    {" "}
                    {unit}{" "}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="eg: 199"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label
              htmlFor="image"
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-5 py-3 hover:bg-green-100 transition-all w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" />
              Upload image
            </label>

            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            {frontImg && (
              <Image
                src={frontImg}
                width={100}
                height={100}
                alt="image"
                className="rounded-xl shadow-md border border-gray-200 object-cover"
              />
            )}
          </div>
          
          <motion.button
            whileHover={{scale: 1.02,}}
            whileTap={{scale: 0.9,}}
            disabled={loading}
            className="mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Add Grocery"}
          </motion.button>

        </form>

      </motion.div>
    </div>
  );
}

export default AddGrocery;
