import { prisma } from "../lib/prisma.ts";
import { Role } from "../generated/prisma/enums.ts";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.ts";

export interface ServiceResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

interface SafeUser {
    id: string;
    name: string;
    email: string;
    role: Role;
    restaurantId: string;
    createdAt: Date;
}

/**********
 * Register
 *********/

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

interface RegisterResponse extends SafeUser {}

// register
export const register = async (
    input: RegisterInput
): Promise<ServiceResponse<RegisterResponse>> => {
    try {
        const { name, email, password } = input;

        // Normalize email
        const normalizedEmail = email.trim().toLowerCase();

        // Check existing user
        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail
            },
        });

        if (existingUser) {
            return {
                success: false,
                message: "An account with this email already exists.",
            }
        }

        // Check password length
        if (password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters long!"
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Get restaurant Id
        const restaurant = await prisma.restaurant.findFirst();
        if (!restaurant) {
            return {
                success: false,
                message: "Restaurant setup is incomplete. Please contact support!"
            }
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash,
                role: Role.STAFF,
                restaurantId: restaurant.id
            },
        });

        // Return safe user object
        return {
            success: true,
            message: "Account created successfully.",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                restaurantId: user.restaurantId,
                createdAt: user.createdAt,
            },
        };
        
    } catch (error: unknown) {
        console.error("Register service error");

        return {
            success: false,
            message: "Unable to create account at this time. Please try again."
        }
    }
}

/**********
 * Login
 *********/

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResponse {
    user: SafeUser;
    accessToken: string;
}

// login
export const login = async (
    input: LoginInput
): Promise<ServiceResponse<LoginResponse>> => {
    try {
        const { email, password } = input;

        const normalizedEmail = email.trim().toLowerCase();

        // Check email
        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            }
        })

        if (!user) {
            return {
                success: false,
                message: "Invalid email or password!"
            }
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password!",
            }
        }

        // Generate token
        const token = generateToken({
                userId: user.id,
                restaurantId: user.restaurantId,
                role: user.role
            });

        // User mapping helper
        const toSafeUser = (user: any): SafeUser => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurantId,
            createdAt: user.createdAt,
        })

        return {
            success: true,
            message: "Login successful",
            data: {
                user: toSafeUser(user),
                accessToken: token,
            }
        }

    } catch (error: unknown) {
        console.error("Login service error:", error);

        return {
            success: false,
            message: "Unable to login at this time!"
        }
    }
}