import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { CsrfController } from './csrf/csrf.controller';
import { CsrfTokenMiddleware } from './middleware/csrf.middleware';
import { ConfigModule } from './config/config.module';


@Module({
  imports: [UsersModule, ConfigModule],
  controllers: [CsrfController],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CsrfTokenMiddleware).forRoutes('*');
  }
}
