import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureProxy } from './proxy.config';

@Module({})
export class ProxyModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const proxies = configureProxy(this.configService);
    proxies.forEach((proxy) =>
      consumer.apply(proxy.middleware).forRoutes(proxy.context),
    );
  }
}
