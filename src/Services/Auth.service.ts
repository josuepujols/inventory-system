import bcrypt from 'bcryptjs';

export class AuthService {
    async EncryptPassword(pass: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(pass, salt)
    };

    async ComparePassword(pass: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(pass, hash);
    };
}