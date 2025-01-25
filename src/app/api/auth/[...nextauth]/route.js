import { connectToDatabase } from "@/utils/mongo";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/users";
import bcrypt from "bcrypt";

 const authOptions = {
    providers:[
        CredentialsProvider({
            name:"credentials",
            credentials:{},

            async authorize(credentials){
                const {email, password} = credentials;

                try{
                    await connectToDatabase()
                    const user = await User.findOne({email})

                    if (!user){
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)

                    if (!passwordsMatch){
                        return null
                    }

                    return user;
                }
                catch(error){
                    console.log("Error: ", error)
                }
                

                
            },
        }),
    ],
    session:{
        strategy:"jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn:"/auth/login"
    },
    
 };

 const handler = NextAuth(authOptions);

 export {handler as GET, handler as POST};