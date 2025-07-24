import { NextRequest, NextResponse } from "next/server";
import { createUser, UserData } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password }: UserData = await req.json();
    
    // Validate input
    if (!email || !username || !password) {
      return NextResponse.json(
        { message: "Email, username, and password are required." }, 
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." }, 
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." }, 
        { status: 400 }
      );
    }

    // Validate username
    if (username.length < 3) {
      return NextResponse.json(
        { message: "Username must be at least 3 characters long." }, 
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser({ email, username, password });

    return NextResponse.json(
      { 
        message: "Registration successful.",
        user: {
          id: user.id.toString(),
          email: user.email,
          username: user.username
        }
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User with this email or username already exists') {
      return NextResponse.json(
        { message: "User with this email or username already exists." }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again." }, 
      { status: 500 }
    );
  }
} 