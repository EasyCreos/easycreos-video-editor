import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        const envFile = path.resolve(process.cwd(), '.env');
        this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    }

    get(key: string, defaultValue?: string): string {
        return this.envConfig[key] ?? defaultValue;
    }

    getNumber(key: string, defaultValue?: number): number {
        const value = this.get(key);
        if (value !== undefined && value !== null) {
            const num = Number(value);
            return isNaN(num) ? (defaultValue ?? 0) : num;
        }
        return defaultValue ?? 0;
    }

    getBoolean(key: string, defaultValue?: boolean): boolean {
        const value = this.get(key);
        return value ? value === 'true' : defaultValue ?? false;
    }
}
