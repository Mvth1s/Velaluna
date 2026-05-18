import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m',  target: 10 },
    { duration: '30s', target: 0  },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed:   ['rate<0.01'],
  },
}

export default function () {
  let res

  res = http.get(`${BASE_URL}/api/themes`)
  check(res, { 'GET /api/themes → 200': r => r.status === 200 })
  sleep(0.3)

  res = http.get(`${BASE_URL}/api/technologies`)
  check(res, { 'GET /api/technologies → 200': r => r.status === 200 })
  sleep(0.3)

  res = http.get(`${BASE_URL}/api/technologies/javascript`)
  check(res, { 'GET /api/technologies/javascript → 200': r => r.status === 200 })
  sleep(0.3)

  res = http.get(`${BASE_URL}/api/technologies/javascript/nodes`)
  check(res, { 'GET /api/technologies/javascript/nodes → 200': r => r.status === 200 })
  sleep(0.3)

  res = http.get(`${BASE_URL}/api/nodes/variables`)
  check(res, { 'GET /api/nodes/variables → 200': r => r.status === 200 })
  sleep(0.3)

  res = http.get(`${BASE_URL}/api/nodes/inexistant`)
  check(res, { 'GET /api/nodes/inexistant → 404': r => r.status === 404 })
  sleep(0.5)
}
