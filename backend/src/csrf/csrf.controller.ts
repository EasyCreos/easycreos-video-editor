import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('csrf')
export class CsrfController {
    @Get()
    getCsrfToken(@Req() req: Request, @Res() res: Response) {
        res.json({ csrfToken: req.csrfToken() });
    }
}
