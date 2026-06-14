"use client";
import { RootState } from "@/redux/store";
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet";
import axios from "axios";
import toast from "react-hot-toast";

// Dynamic import
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false },
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false },
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

function Checkour() {
  const router = useRouter();
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );
  //   console.log(userData)

  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData.name || "",
        mobile: userData.mobile || "",
      }));
    }
  }, [userData]);

  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // console.log(pos);
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.log("location error", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000 },
      );
    }
  }, []);

  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      setCustomIcon(icon);
    });
  }, []);

  const handleMarkerDrag = async (e: any) => {
    const marker = e.target;
    const { lat, lng } = marker.getLatLng();
    setPosition([lat, lng]);
    try {
      const result = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await result.data;
      // console.log(data)
      setAddress((prev) => ({
        ...prev,
        city: data.address?.city || data.address?.town || "",
        state: data.address?.state || "",
        pincode: data.address?.postcode || "",
        fullAddress: data?.display_name || "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const ChangeMapCenter = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
      // map.flyTo(position,map.getZoom());
      map.setView(position, map.getZoom(), { animate: true });
    }, [position, map]);
    return null;
  };

  const [searchLocation, setSearchLocation] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSearchLocation = async () => {
    if (!searchLocation.trim()) return;

    setSearchLoading(true);
    try {
      const result = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`,
      );
      const data = await result.data;
      // console.log(data)
      setSearchLoading(false);
      setSearchLocation("");

      if (data.length === 0) {
        alert("Location not found");
        return;
      }

      const lat = Number(data[0].lat);
      const lng = Number(data[0].lon);

      setPosition([lat, lng]);

      setAddress((prev) => ({
        ...prev,
        city: data[0].address?.city || data[0].address?.town || "",
        state: data[0].address?.state || "",
        pincode: data[0].address?.postcode || "",
        fullAddress: data[0].display_name || "",
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (positionData) => {
        const lat = positionData.coords.latitude;
        const lng = positionData.coords.longitude;
        setPosition([lat, lng]);
        try {
          const result = await axios(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
          );
          const data = await result.data;
          setAddress((prev) => ({
            ...prev,
            city: data.address?.city || data.address?.town || "",
            state: data.address?.state || "",
            pincode: data.address?.postcode || "",
            fullAddress: data?.display_name || "",
          }));
        } catch (error) {
          console.log(error);
        }
      },
      (error) => {
        console.log(error);
        alert("Unable to fetch location");
      },
    );
  };

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");

  const handleCod= async ()=>{
    if(!position) return null

    try {
      const result=await axios.post('/api/user/order',{
        userId: userData?._id,
        items:cartData.map((item:any)=>({
          grocery:item._id,
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image
        })),
        totalAmount:finalTotal,
        address:{
          fullName:address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.state,
          pincode:address.pincode,
          fullAddress:address.fullAddress,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod
      })
      const data=result.data
      toast.success(data.message)
      // console.log(result.data);
      router.push('/user/order-success')

      
    } catch (error:any) {
      // console.log(error)
      toast.error(error.response.data.message)
    }
  }


  const handleOnlinePayment= async ()=>{
    console.log("hello");
    if(!position) return null
    
    
    try {
      const result=await axios.post('/api/user/payment',{
        userId: userData?._id,
        items:cartData.map((item:any)=>({
          grocery:item._id,
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image
        })),
        totalAmount:finalTotal,
        address:{
          fullName:address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.state,
          pincode:address.pincode,
          fullAddress:address.fullAddress,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod
      })
      const data=result.data
      window.location.href=data.url
      console.log(data)

    } catch (error:any) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }

  

  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={() => router.push("/user/cart")}
      >
        <ArrowLeft size={16} />
        <span>Back to cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Left Div */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" />
            Delivery Address
          </h2>
          <div className="space-y-4">
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <MapPin
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />

              <input
                type="text"
                value={address.fullAddress}
                placeholder="Full Address"
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />

                <input
                  type="text"
                  value={address.city}
                  placeholder="city"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  placeholder="state"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, state: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.pincode}
                  placeholder="pincode"
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, pincode: e.target.value }))
                  }
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
              />
              <button
                onClick={handleSearchLocation}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium"
              >
                {searchLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Map codes */}
            <div className="relative mt-6 h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  center={position}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="relative h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker
                    position={position}
                    icon={customIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: handleMarkerDrag,
                    }}
                  >
                    <Popup>Delivery Location</Popup>
                  </Marker>

                  <ChangeMapCenter position={position} />
                </MapContainer>
              )}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCurrentLocation}
                className="absolute bottom-4 right-4 bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-[999]"
              >
                <LocateFixed />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right div */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-600" />
            Payment Method
          </h2>

          <div className="space-y-4 mb-5">
            <button
              onClick={() => setPaymentMethod("online")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "online"
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <CreditCardIcon className="text-green-600" />

              <span className="font-medium text-gray-700">
                Pay Online (stripe)
              </span>
            </button>

            <button
              onClick={() => setPaymentMethod("cod")}
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "cod"
                  ? "border-green-600 bg-green-50 shadow-sm"
                  : "hover:bg-gray-50"
              }`}
            >
              <Truck className="text-green-600" />

              <span className="font-medium text-gray-700">
                Cash on Delivery
              </span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-green-600">₹{subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-green-600">
                ₹{deliveryFee}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Final Total</span>
              <span className="font-semibold text-green-600">
                ₹{finalTotal}
              </span>
            </div>
          </div>

          <motion.button
            whileTap={{scale: 0.93}}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold"
            onClick={()=>paymentMethod=="cod" ? handleCod() : handleOnlinePayment()}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkour;

// <-----------------------------Map------------------------------------>
// for map we use leaflet: https://leafletjs.com/?utm_source=chatgpt.com, https://www.npmjs.com/package/leaflet?activeTab=dependents

// install these two packeges for usesing of map

// npm install leaflet react-leaflet
// npm install -D @types/leaflet


