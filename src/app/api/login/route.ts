import { NextRequest, NextResponse } from "next/server";
import { authenticateUser, LoginData } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password }: LoginData = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." }, 
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser({ email, password });

    return NextResponse.json(
      { 
        message: "Login successful.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return NextResponse.json(
        { message: "Invalid email or password." }, 
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again." }, 
      { status: 500 }
    );
  }
} 