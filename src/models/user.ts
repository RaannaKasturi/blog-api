/*
 * File: user.ts                                                               *
 * Project: blog-api                                                           *
 * Created Date: Tue Sep 16 2025                                               *
 * Author: Nayan (Raanna) Kasturi                                              *
 * -----                                                                       *
 * Last Modified: Tue Sep 16 2025                                              *
 * Modified By: Nayan (Raanna) Kasturi                                         *
 * -----                                                                       *
 * Copyright (c) 2025 Binary Biology. All rights reserved.                     *
 * License: Apache-2.0                                                         *
 * License URL: https://www.apache.org/licenses/LICENSE-2.0                    *
 * Contact: raanna@binarybiology.top                                           *
 * --------------------------------------------------------------------------  *
 */



import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser {
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    firstName?: string;
    lastName?: string;
    socialLinks: {
        website?: string;
        facebook?: string;
        instagram?: string;
        x?: string;
        youtube?: string;
    }
}

// User Schema
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username already exists"],
        maxLength: [15, "Username must be less than 15 character"],
        minLength: [3, "Username must be at least 3 character"],
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        match: [/\S+@\S+\.\S+/, "Email is invalid"],
        validate: {
            validator: function (value: string) {
                return !value.includes('+');
            },
            message: "Extended email IDs are not allowed"
        },
        maxLength: [50, "Email must be less than 50 character"],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must be at least 8 character"],
        maxLength: [32, "Password must be less than 32 character"],
        select: false,
        trim: true,
        validate: {
            validator: function (value: string) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/.test(value);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
        }
    },
    role: {
        type: String,
        required: true,
        enum: {
            values: ['admin', 'user'],
            message: "{VALUE} is not a valid role"
        },
        default: 'user'
    },
    firstName: {
        type: String,
        maxLength: [30, "First name must be less than 30 character"],
        trim: true,
        default: null
    },
    lastName: {
        type: String,
        maxLength: [30, "Last name must be less than 30 character"],
        trim: true,
        default: null
    },
    socialLinks: {
        website: {
            type: String,
            match: [/^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-]*)*\/?$/, "Website URL is invalid"],
            trim: true,
            default: null
        },
        facebook: {
            type: String,
            match: [/^(https?:\/\/)?(www\.)?facebook\.com\/[A-Za-z0-9_.-]+\/?$/, "Facebook URL is invalid"],
            trim: true,
            default: null
        },
        instagram: {
            type: String,
            match: [/^(https?:\/\/)?(www\.)?instagram\.com\/[A-Za-z0-9_.-]+\/?$/, "Instagram URL is invalid"],
            trim: true,
            default: null
        },
        x: {
            type: String,
            match: [/^(https?:\/\/)?(www\.)?x\.com\/[A-Za-z0-9_.-]+\/?$/, "X (Twitter) URL is invalid"],
            trim: true,
            default: null
        },
        youtube: {
            type: String,
            match: [/^(https?:\/\/)?(www\.)?youtube\.com\/[A-Za-z0-9_.-]+\/?$/, "YouTube URL is invalid"],
            trim: true,
            default: null
        }
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = model<IUser>('User', userSchema);
export default User;