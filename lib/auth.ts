import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export interface UserData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(userData: UserData) {
  const { email, username, password } = userData;
  
  // Check if user already exists
  const existingUser = await prisma.tobacco_users.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    throw new Error('User with this email or username already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.tobacco_users.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
    }
  });

  return user;
}

export async function authenticateUser(loginData: LoginData) {
  const { email, password } = loginData;

  // Find user by email
  const user = await prisma.tobacco_users.findFirst({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, user.password);
  
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id.toString(),
    email: user.email,
    username: user.username,
  };
}

export async function getUserById(id: string) {
  const user = await prisma.tobacco_users.findUnique({
    where: { id: BigInt(id) },
    select: {
      id: true,
      email: true,
      username: true,
    }
  });

  return user;
} 