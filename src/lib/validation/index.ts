import { z } from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { message: 'Too short'}),
    username: z.string().min(2, { message: 'Too short'}),
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters.'}),
})

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: 'Invalid password'}),
})

export const PostValidation = z.object({
    caption: z.string()
        .min(5, { message: "Caption too short, at least 5 character(s)" })
        .max(2200, { message: "Caption too long, maximum 2200 character(s)" }),
    file: z.custom<File[]>(),
    location: z.string().min(2).max(100),
    tags: z.string(),
})