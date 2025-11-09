import { configureProxy } from './proxy.config';
import { ConfigService } from '@nestjs/config';
import type { RequestHandler, Request, Response, NextFunction } from 'express';

interface CapturedOptions {
  target: string;
  changeOrigin: boolean;
  pathRewrite?: (path: string, req: any) => string;
}

const captured: CapturedOptions[] = [];

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: (opts: CapturedOptions): RequestHandler => {
    captured.push(opts);
    const handler = (_req: Request, _res: Response, next: NextFunction) => {
      next();
    };
    return handler as unknown as RequestHandler;
  },
}));

describe('configureProxy', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  it('should create proxy definition for /products with pathRewrite', () => {
    const mockConfigService: Partial<ConfigService> = {
      get: (key: string) => {
        if (key === 'PRODUCT_SERVICE_URL') return 'http://product-service:4000';
        return undefined;
      },
    };

    const result = configureProxy(mockConfigService as ConfigService);

    expect(result).toHaveLength(1);
    expect(result[0].context).toBe('/products');
    expect(typeof result[0].middleware).toBe('function');

    expect(captured).toHaveLength(1);
    const opts = captured[0];
    expect(opts.target).toBe('http://product-service:4000');
    expect(opts.changeOrigin).toBe(true);
    expect(typeof opts.pathRewrite).toBe('function');

    const rewritten = opts.pathRewrite!('/products/list', {
      originalUrl: '/products/list?order=asc',
    });
    expect(rewritten).toBe('/products/list?order=asc');

    const fallback = opts.pathRewrite!('/products', {});
    expect(fallback).toBe('/products');
  });

  it('should throw if PRODUCT_SERVICE_URL is missing', () => {
    const mockConfigService: Partial<ConfigService> = {
      get: () => undefined,
    };
    expect(() => configureProxy(mockConfigService as ConfigService)).toThrow(
      'PRODUCT_SERVICE_URL is not configured',
    );
  });
});
