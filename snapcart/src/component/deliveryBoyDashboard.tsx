"use client";
import { getSocket } from "@/lib/socket";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import LiveMap from "./liveMap";
import DeliveryChat from "./deliveryChat" 
import { Loader } from "lucide-react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface ILocation {
  latitude: number;
  longitude: number;
}

function DeliveryBoyDashboard({earning}:{earning:number}) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const { userData } = useSelector((state: RootState) => state.user);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendOtpLoading,setSendOtpLoading]=useState(false)
  const [verifyOtpLoading,setVerifyOtpLoading]=useState(false)
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<ILocation>({
    latitude: 82.99827455252156,
    longitude: 25.34368710175429,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 82.99827455252156,
    longitude: 25.34368710175429,
  });

  const fetchAssignments = async () => {
    try {
      const result = await axios.get("/api/delivery/get-assignments");
      // console.log(result.data)
      setAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentOreder = async () => {
    try {
      const result = await axios.get("/api/delivery/current-order");
      const data = result.data;
      // console.log(data);
      if (data.active) {
        setActiveOrder(data.assignment);
        setUserLocation({
          latitude: data.assignment.order.address.latitude,
          longitude: data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAssignments();
    fetchCurrentOreder();
  }, [userData]);

  useEffect((): any => {
    const socket = getSocket();
    socket.on("update-deliveryBoy-location", ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });
    return () => socket.off("update-deliveryBoy-location");
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;

    const watcher = navigator.geolocation.watchPosition(
      //watchPosition->continues watch the location
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({ latitude: lat, longitude: lon });
        socket.emit("update-location", {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true },
    );

    return () => navigator.geolocation.clearWatch(watcher);
  });

  useEffect((): any => {
    //socket connection for real time delivery assignments update
    const socket = getSocket();
    socket.on("new-assignment", (deliveryAssignment) => {
      setAssignments((prev) => [deliveryAssignment, ...prev]);
    });
    return () => socket.off("new-assignment");
  }, []);

  const handleAccept = async (id: string) => {
    try {
      const result = await axios.get(
        `/api/delivery/assignment/${id}/accept-assignment`,
      );
      // console.log(result.data)
      toast.success(result.data.message);
      await fetchCurrentOreder()
    } catch (error: any) {
      toast.error(error.response.data?.message);
    }
  };

  const sendOtp = async () => {
    setSendOtpLoading(true)
    try {
      const result = await axios.post("/api/delivery/otp/send", {
        orderId: activeOrder.order._id,
      });
      toast.success(result.data.message);
      setShowOtpBox(true);
    } catch (error:any) {
      toast.error(error.response.data?.message);
    } finally {
       setSendOtpLoading(false)
    }
  };

  const verifyOtp=async ()=>{
    setVerifyOtpLoading(true)
    try {
      const result = await axios.post("/api/delivery/otp/verify", {orderId: activeOrder.order._id, otp});
      // console.log(result.data)
      toast.success(result.data.message);
      setActiveOrder(null)
      await fetchCurrentOreder()
      window.location.reload()
    } catch (error:any) {
      toast.error(error.response.data?.message);
    } finally{
      setVerifyOtpLoading(false)
    }
  }

  if (!activeOrder && assignments.length === 0) {
  const todayEarning = [
    {
      name: "Today",
      earning,
      deliveries: earning / 40,
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-white to-green-50 p-6">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          No Active Deliveries 🚚
        </h2>

        <p className="text-gray-500 mb-5">
          Stay online to receive new orders
        </p>

        <div className="bg-white border rounded-xl shadow-xl p-6">
          <h2 className="font-medium text-green-700 mb-2">
            Today's Performance
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={todayEarning}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar dataKey="earnings" name="Earnings (₹)"/>
              <Bar dataKey="deliveries" name="Deliveries"/>
            </BarChart>
          </ResponsiveContainer>

          <p className="mt-4 text-lg font-bold text-green-700"> ₹{earning || 0} Earned today </p>

          <button
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Refresh Earnings
          </button>
        </div>
      </div>
    </div>
  );
}



  if (activeOrder && userLocation) {
    return (
      <div className="p-4 pt-[120px] min-h-screen bg-gray-50 ">
        <div className="max-w-3xl mx-auto ">
          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h1>

          <p className="text-gray-600 text-sm mb-4">
            order#{activeOrder.order._id.slice(-6)}
          </p>

          <div className="rounded-xl border shadow-lg overflow-hidden mb-6">
            <LiveMap
              userLocation={userLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>

          <DeliveryChat
            orderId={activeOrder?.order?._id}
            deliveryBoyId={userData?._id?.toString()!}
          />

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {!activeOrder.order.deliveryOtpVerification && !showOtpBox && (
              <button
                onClick={sendOtp}
                className="w-full py-4 bg-green-600 text-white rounded-lg flex items-center justify-center"
              >
                {sendOtpLoading ? <Loader size={25} className="animate-spin "/> : "Mark as Delivered"}
              </button>
            )}
            {showOtpBox && 
              <div className="mt-4">
                <input 
                type="text" 
                maxLength={4} 
                placeholder="Enter Otp"
                value={otp}
                onChange={(e)=>setOtp(e.target.value)}
                className="w-full py-3 border rounded-lg text-center items-center"/>
                <button onClick={verifyOtp} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center">{verifyOtpLoading ? <Loader size={25} className="animate-spin"/> : "Verify OTP"}</button>
              </div>
            }
            {
            activeOrder.order.deliveryOtpVerification && <div className="text-green-700 text-center font-bold">Delivery Completed!</div>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mt-[120px] mb-[30px]">
          Delivery Assignments
        </h2>

        {assignments.map((a) => (
          <div
            key={a._id}
            className="p-5 bg-white rounded-xl shadow mb-4 border"
          >
            <p>
              <b>Order Id </b> #{a?.order?._id.slice(-6)}
            </p>
            <p className="text-gray-600"> {a.order.address.fullAddress} </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleAccept(a._id)}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg"
              >
                Accept
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryBoyDashboard;
