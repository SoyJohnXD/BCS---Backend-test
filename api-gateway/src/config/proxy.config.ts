import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler } from 'express';

interface ProxyServiceOptions {
  context: string;
  target: string;
}

interface ProxyDefinition {
  context: string;
  middleware: RequestHandler;
}

/**
 * Función que genera un array de middlewares de proxy configurados.
 * Lee las URLs de los servicios de las variables de entorno.
 *
 * @param configService El servicio de configuración para leer las variables de entorno.
 * @returns Un array de middlewares de proxy listos para ser aplicados.
 */
export const configureProxy = (
  configService: ConfigService,
): ProxyDefinition[] => {
  const getRequiredServiceUrl = (variable: string): string => {
    const value = configService.get<string>(variable);
    if (!value) {
      throw new Error(`${variable} is not configured`);
    }
    return value;
  };

  const services: ProxyServiceOptions[] = [
    {
      context: '/auth',
      target: getRequiredServiceUrl('AUTH_SERVICE_URL'),
    },
    {
      context: '/products',
      target: getRequiredServiceUrl('PRODUCT_SERVICE_URL'),
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
