import connectDB from '@/lib/db'
import DeliveryBoyDashboard from './deliveryBoyDashboard'
import { auth } from '@/auth'
import { Order } from '@/models/order.model'

async function DeliveryBoy() {
  await connectDB()
  const session=await auth()
  const deliveryBoyId=session?.user?.id
  const orders=await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true
  }) 
  

  const today=new Date().toDateString()
  const todayOrders=orders.filter((o)=>new Date(o.deliveredAt).toDateString()===today).length
  const todaysEarning=todayOrders*40                 //40 rupees per order
  return (
    <>
      <DeliveryBoyDashboard earning={todaysEarning}/>
    </>
  )
}

export default DeliveryBoy