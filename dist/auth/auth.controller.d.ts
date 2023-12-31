import { AuthService } from './auth.service';
import { AuthDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(dto: AuthDto): Promise<{
        id: number;
        createdAt: Date;
        udpdatedAt: Date;
        email: string;
        hash: string;
        firstName: string;
        lastName: string;
    }>;
    signin(dto: AuthDto): Promise<{
        access_token: string;
    }>;
}
