import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler, Request } from 'express';

interface ProxyServiceOptions {
  context: string;
  target: string;
}

interface ProxyDefinition {
  context: string;
  middleware: RequestHandler;
}

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
      context: '/products',
      target: getRequiredServiceUrl('PRODUCT_SERVICE_URL'),
    },
  ];

  return services.map((service) => ({
    context: service.context,
    middleware: createProxyMiddleware({
      target: service.target,
      changeOrigin: true,
      pathRewrite: (path: string, req: Request) => {
        const originalPath = req.originalUrl;
        return originalPath ?? path;
      },
    }),
  }));
};
