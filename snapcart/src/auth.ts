import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db";
import { User } from "./models/user.model";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
        credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
       async authorize(credentials) {
        await connectDB(); 

        let email = credentials?.email as string
        let password = credentials?.password as string

        if(!email || !password){
            throw new Error("email or password required")
        }

        const user = await User.findOne({ email });

        if (!user) throw new Error("User does not exist");

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],

 //put the user detail in token
  callbacks: {

    async signIn({account,user}){                              //user have the value which is return by google
      if(account?.provider=="google"){                         //run when login/registrer using google
        await connectDB(); 
        let existUser = await User.findOne({email:user?.email})
        if(!existUser){
            existUser = await User.create({
                name:user?.name,
                email:user?.email,
                image:user?.image
            })
        }
        user.id=existUser._id.toString()
        user.role=existUser.role
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {      //user have all the values which is return by providers.authorize function
      if(user){
        token.id=user.id;
        token.name=user.name;
        token.email=user.email;
        token.role=user.role;         //user does not have role but we have declared in 'next-auth.d.ts' file so we can use here and assign value to it from user.role which is return by providers.authorize function
      }

      if(trigger=="update"){     //we update the token
        token.role=session.role
      }

      return token;
    },

    //put the token detail in session
    session({session,token}){                          //session.user doesn’t have id so we declare in 'next-auth.d.ts' file
      if(session.user){
        session.user.id=token.id as string
        session.user.name=token.name as string
        session.user.email=token.email as string
        session.user.role=token.role as string  
      }
      return session;
    }
  },

  session: {
    strategy: "jwt",                    //take the data from jwt
    maxAge:30*24*60*60                  //session take the time in second , 30 Days
  },

  pages: {
    signIn: "/login",                  // custom login page
    error:  "/login",                  // if any error occur then also on login page
  },

  secret: process.env.AUTH_SECRET,                      //for encrypt the data in jwt

})







// <---------------------------------------- Notes --------------------------------------->
// line 44 : user is 'User' type which is comes from next-auth,
// User have only id, email and name so we add the role in User type in 'next-auth.d.ts' file and assign the value to it from user.role which is return by providers.authorize function  



