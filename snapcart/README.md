# video 1
1.install -> mongoose axios bcrypt
2.create models -> user.model.ts
3.create lib/db.ts and globle.d.ts 
4.create api/auth/register

<--------------------Auth.js SetUp----------------------->
for SinhIn use Auth.js which is updated version of Next-auth
Auth.js link : https://authjs.dev/
5.create api/auth/[...nextauth] and auth.ts and next-auth.d.ts


<------------------Frontend setup------------------------->
6.create app/register and create conponenet/welcome and conponenet/registerForm

for animation we use motion library (npm install motion) : https://motion.dev/
for icons we use lucide-icon (npm install lucide-react): https://lucide.dev/

7.create app/login
8.create ClientProvider for wrap the children by sessionProvider 
8.add google authentication code in auth.ts
9.create proxy.ts

Note:Take the data from Auth.js 
in frontend use : useSession() hook
and in backend we use 'auth'

10.write code in Home page and create component/editRoleMobile.tsx and use it in Home page
11.create api/edit-role- mobile and use in editRoleMobile.tsx file

12.create component/nav.tsx and use in home page

13.create component/userDash.tsx and use in home page
14.create component/heroSection.tsx and use in userDash.tsx

15.create models/grocery.model.ts
16.create lib/cloudinary.ts
17.create api/admin/add-grocery
18.create app/admin/add-grocery 

# Video 2
19.create component/categorySlider.tsx and use in userDash.tsx
20.create component/groceryItemCard.tsx and use in userDash.tsx

# Redux install : npm install @reduxjs/toolkit react-redux
# Redux link : https://redux-toolkit.js.org/tutorials/typescript

21.create app/redux/store.ts, userSlice.ts, StoreProvider.tsx, cartSlice.ts use in groceryItemCard.tsx and nav.tsx

22.create app/user/cart
23.create app/user/checkout

Map: 4:08 (https://www.youtube.com/watch?v=dk_Tr0f53XM&t=8031s)
// npm install leaflet react-leaflet
// npm install -D @types/leaflet

And write map code in app/user/checkout

24.create models/order.model.ts
25.create api/user/order and use in app/user/checkout 
26.create app/user/order-success

<--------------------------Online Payment : 6:44---------------------------------->
use stripe : https://dashboard.stripe.com/acct_1Tbnd5FDr9VLkeWk/test/dashboard, 
27.create api/user/payment
28.create api/user/stripe/webhook

<---------------------------------------------------------------------------------->
29.create api/user/my-orders
30.create app/user/my-orders
31.create 'componenet/userOrderCard' and use in 'app/user/my-orders'
32.create api/admin/get-orders
33.create 'app/admin/manage-orders' and use 'api/admin/get-orders'
34 create 'componenet/adminOrderCard' and use in 'app/admin/manage-orders'
35.create 'model/deliveryAssignment.model'

<----------------------Socket setup: 0:36------------------------>
36.create 'socketServer' seperate backend folder
37.create lib/socket
38.create component/geoUpdater and use in page.tsx
39.create api/socket/connect and api/socket/update-location and call in index.js of socketServer

<-------------------------------------------------------->
40.create api/admin/update-order-status and use in component/adminOrderCard
41.create api/check-for-admin and use in component/editRoleMobile
42.create component/deliveryBoyDashboard and use in component/deliveryBoy
43.create api/delivery/get-assignments and use in component/deliveryBoyDashboard

<-----------------------setup socket for real time order create and update------------------------------->
44.create notify api in socketServer/index.js
45.create lib/emitEventHandler 
46.add 'await emitEventHandler("new-order",newOrder)' in api/user/order to emit the data 
47.create useEffect() in 'app/admin/manage-order' to take(listen) created newOrder data from socketServer/index.js

48.add 'await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})' in api/user/order 
49.create useState() in component/userOrderCard 
50.add 'await emitEventHandler("new-assignment",deliveryAssignment)' in api/user/order 
51.create useEffect() in component/deliveryBoyDashboard 


<----------------------------------------------------------------------------------->
52.create api/deliviry/assignment/[id]/accept-assignment and use in component/deliveryBoyDashboard
53.add deliveruBoy Info in component/userOrderCard
54.create api/delivery/current-order and use in component/deliveryBoydashboard
55.create component/lifeMap and use in component/deliveryBoydashboard
56.create app/user/track-order/[orderId] 
57.create api/user/get-order/[orderId] and use in app/user/track-order/[orderId]

<--------------------Message Part Start----------------->
58.create models/message.model.ts
59.create api/chat/save and api/chat/messages 
60.create component/deliveryChat and use in component/deliveryBoyDashboard
61.create 'join-room' and 'send-message' function in index.js and use in componenet/deliveryChat 
62.add same code of componenet/deliveryChat in app/user/track-order

<-----------Now use Gemini Api Key for chat suggestion (7:35)---------->
63.get Api key and add in .env.local
64.create api/chat/ai-suggestions and use in componenet/deliveryChat and app/user/track-order

<-------------------------- Nodemailer inpliment : https://nodemailer.com/ --------------------->
npm install nodemailer
npm i --save-dev @types/nodemailer

65.add EMAIL ans PASS in '.env'
66.create lib/mailer.ts
67.add deliveryOtp, deliveryOtpVerification, deliveredAt field in models/order.model
68.create api/delivery/otp/send and api/delivery/otpverify and use in componenet/deliveryBoyDashboard
69.add 
await order.populate("assignedDeliveryBoy")
await emitEventHandler("order-assigned",{orderId:order._id,assignedDeliveryBoy:order.assignedDeliveryBoy})
in api/delivery/assignment and use this socket in app/user/my-order and app/admin/manage-order 
for when deliveryBoy assigned real time update

70.add 
await emitEventHandler("order-status-update",{orderId:order._id,status:order.status}) in api/delivery/otp/verify
and use in componenet/adminOrderCart and componenet/userOrderCart for real time update order status

<-------------------------------------------------------------------------------->
71.create component/adminDashboardClient and use in component/adminDashboard
72.write the code in component/adminDashboard and component/adminDashboardClient

for chart : use recharts : (npm i recharts)

73.create app/admin/view-grocery
74.create api/admin/get-groceries, api/admin/edit-grocery and api/admin/delete-grocery and use in app/admin/view-grocery
75.write the code in component/deliveryBoy and use in component/deliveryBoyDashboard

# Video 4 
76.write the code for search in nav and use in app/page.tsx
77.create componenet/footer and use in app/page.tsx

<----------------------Deploy : after 1 hour------------------------>









