import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfTokenMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (typeof (req as any).csrfToken === 'function') {
            const token = (req as any).csrfToken();
            res.cookie('XSRF-TOKEN', token, {
                httpOnly: false,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });
        }
        next();
    }
}
