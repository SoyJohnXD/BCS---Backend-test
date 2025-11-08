import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureProxy } from './config/proxy.config';

@Module({})
export class ProxyModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Configura los middlewares de proxy para la aplicación.
   * Este método es llamado por NestJS al inicializar el módulo.
   *
   * @param consumer El consumidor de middleware al que se aplicarán los proxies.
   */
  configure(consumer: MiddlewareConsumer) {
    const proxies = configureProxy(this.configService);

    proxies.forEach((proxy) => {
      consumer.apply(proxy.middleware).forRoutes(proxy.context);
    });
  }
}
