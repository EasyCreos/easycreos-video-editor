import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: (err: Error | null, user: any) => void) {
    done(null, { id: user.id, email: user.email, name: user.name });
  }

  deserializeUser(payload: any, done: (err: Error | null, user: any) => void) {
    done(null, payload);
  }
}
