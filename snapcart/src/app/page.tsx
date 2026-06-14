import Image from "next/image";
import connectDB from "../lib/db";
import {auth} from '@/auth'
import EditRoleMobile from "@/component/editRoleMobile";
import { User } from "@/models/user.model";
import { redirect } from "next/navigation";
import Nav from "@/component/nav";
import AdminDashboard from "@/component/adminDashboard";
import DeliveryBoy from "@/component/deliveryBoy";
import UserDashboard from "@/component/userDash";
import GeoUpdater from "@/component/geoUpdater";
import { Grocery, IGrocery } from "@/models/grocery.model";
import Footer from "@/component/footer";

export default async function Home(props:{
  searchParams:Promise<{
    q:string                          //thae the value of q from URL
  }>
}) {
  const searchParams=await props.searchParams
  // console.log(searchParams)
  await connectDB()
  const session= await auth()                            
  // console.log(session);
  const user =await User.findById(session?.user?.id)
  
  if(!user){
    redirect('/login');
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role=="user")

  if(inComplete){
    return <EditRoleMobile/> 
  }

  const plainUser=JSON.parse(JSON.stringify(user))  

  // console.log(user);
  // console.log(plainUser);

  let groceryList: IGrocery[] = [];

if (user.role === "user") {
  if (searchParams.q) {
    groceryList = await Grocery.find({
      $or: [
        { name: { $regex: searchParams.q || "", $options: "i" } },
        { category: { $regex: searchParams.q || "", $options: "i" } }
      ]
    });
  }else{
    groceryList=await Grocery.find({})
  }
}
  
  
  return (
    <div>
      <Nav user={plainUser}/>
      <GeoUpdater userId={plainUser._id}/>
      {
        user.role=="user" ? <UserDashboard groceryList={groceryList}/> : user.role=="admin" ? <AdminDashboard/> : <DeliveryBoy/>
      }
      <Footer/>
    </div>
  );
}











// <-------------------------- Notes ----------------------------->
// in Next.js we write backend code in the same file as frontend code. But we have to make the file async and write backend code before return statement. We can also write backend code in separate file and import it in page.tsx file. But we have to make sure that the backend code is written before return statement.

//we write backend code here because we not want to make the page client component this is server component page

//we take the data from session of Auth.js 
//1.in frontend we use useSession() hook
//2.in backend we use auth()

// const plainUser=JSON.parse(JSON.stringify(user))   
//we convert the mongoose document to plain js object because mongoose document have some extra properties and methods which we don't need in frontend and also it will cause error when we try to access the properties of mongoose document in frontend. So we convert it to plain js object using JSON.parse(JSON.stringify()) method.
