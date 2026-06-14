import HeroSection from './heroSection'
import CategorySlider from './categorySlider'
import GroceryItemCard from './groceryItemCard'
import connectDB from '@/lib/db'
import { Grocery, IGrocery } from '@/models/grocery.model'

async function UserDashboard({groceryList}:{groceryList:IGrocery[]}) {
  await connectDB();

  const plainGroceries=JSON.parse(JSON.stringify(groceryList))  

  // console.log(plainGroceries);

  return (
    <div>
        <HeroSection/>
        <CategorySlider/>

        <div className="w-[90%] md:w-[80%] mx-auto mt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center"> Popular Grocery Items </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {plainGroceries.map((item: any, index: number) => (
              <GroceryItemCard key={index} item={item} />
            ))}
          </div>
        </div>
        
    </div>
  )
}

export default UserDashboard          