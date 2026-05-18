import { Registry, collectDefaultMetrics, Counter, Histogram } from 'prom-client'
import type { Request, Response, NextFunction } from 'express'

export const register = new Registry()

collectDefaultMetrics({ register })

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'] as const,
  registers: [register]
})

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
})

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startNs = process.hrtime.bigint()

  res.on('finish', () => {
    const route = `${req.baseUrl}${req.route?.path ?? req.path}`
    const labels = { method: req.method, route, status: String(res.statusCode) }
    httpRequestsTotal.inc(labels)
    httpRequestDuration.observe(labels, Number(process.hrtime.bigint() - startNs) / 1e9)
  })

  next()
}
