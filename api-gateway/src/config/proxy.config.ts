import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

interface ProxyServiceOptions {
  context: string;
  target: string;
}

/**
 * Función que genera un array de middlewares de proxy configurados.
 * Lee las URLs de los servicios de las variables de entorno.
 *
 * @param configService El servicio de configuración para leer las variables de entorno.
 * @returns Un array de middlewares de proxy listos para ser aplicados.
 */
export const configureProxy = (configService: ConfigService) => {
  const services: ProxyServiceOptions[] = [
    {
      context: '/auth',
      target: configService.get<string>('AUTH_SERVICE_URL'),
    },
    {
      context: '/products',
      target: configService.get<string>('PRODUCT_SERVICE_URL'),
    },
  ];

  const proxies = services.map((service) => {
    return {
      context: service.context,
      middleware: createProxyMiddleware({
        target: service.target,
        changeOrigin: true,
        pathRewrite: (path) => path,
      }),
    };
  });

  return proxies;
};
