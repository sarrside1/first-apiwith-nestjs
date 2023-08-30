import { User } from '@prisma/client';
export declare class UserController {
    getMe(user: User): {
        id: number;
        createdAt: Date;
        udpdatedAt: Date;
        email: string;
        hash: string;
        firstName: string;
        lastName: string;
    };
}
