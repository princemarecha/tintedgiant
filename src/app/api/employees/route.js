import employees from "@/app/employees/page";
import { NextResponse } from "next/server"

export  async function GET() {

     return NextResponse.json({ employees: 'John Marecha' });
   }
   
export  async function POST(request) {

    const data  = await request.json()
    return NextResponse.json({ data });
  }