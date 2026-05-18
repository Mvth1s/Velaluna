/**
 * Scénario utilisateur réaliste : accueil → thème → techno → graphe → nœud
 * Simule 3 profils d'utilisateurs en parallèle.
 */
import http from 'k6/http'
import { check, sleep } from 'k6'

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export const options = {
  scenarios: {
    // Utilisateur qui découvre l'app
    explorer: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 5 },
        { duration: '1m',  target: 5 },
        { duration: '20s', target: 0 },
      ],
      exec: 'explorerScenario',
    },
    // Utilisateur qui reprend sa progression
    returning: {
      executor: 'constant-vus',
      vus: 3,
      duration: '1m40s',
      exec: 'returningScenario',
      startTime: '20s',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed:   ['rate<0.01'],
  },
}

// Parcours : accueil → liste des technos du thème → graphe → fiche nœud
export function explorerScenario() {
  let res

  // Charge les thèmes (page d'accueil)
  res = http.get(`${BASE_URL}/api/themes`)
  check(res, { 'themes chargés': r => r.status === 200 })
  sleep(1)

  // Choisit un thème au hasard et charge ses technos
  const themes = ['web', 'scripting', 'langages']
  const theme = themes[Math.floor(Math.random() * themes.length)]

  res = http.get(`${BASE_URL}/api/technologies`)
  check(res, { 'technologies chargées': r => r.status === 200 })
  sleep(1.5)

  // Choisit une techno et charge son graphe
  const techByTheme = {
    web:       ['html-css', 'javascript', 'typescript'],
    scripting: ['bash', 'python', 'git'],
    langages:  ['java', 'c'],
  }
  const techs = techByTheme[theme]
  const tech = techs[Math.floor(Math.random() * techs.length)]

  res = http.get(`${BASE_URL}/api/technologies/${tech}`)
  check(res, { 'techno chargée': r => r.status === 200 })
  sleep(0.5)

  res = http.get(`${BASE_URL}/api/technologies/${tech}/nodes`)
  check(res, { 'graphe chargé': r => r.status === 200 })

  // Ouvre un nœud
  if (res.status === 200) {
    const nodes = res.json('data')
    if (Array.isArray(nodes) && nodes.length > 0) {
      const node = nodes[Math.floor(Math.random() * nodes.length)]
      sleep(2)
      const nodeRes = http.get(`${BASE_URL}/api/nodes/${node.id}`)
      check(nodeRes, { 'fiche nœud chargée': r => r.status === 200 })
    }
  }

  sleep(2)
}

// Parcours : recharge directement une techno connue + quelques nœuds
export function returningScenario() {
  const techs = ['javascript', 'python', 'git', 'java', 'typescript']
  const tech = techs[Math.floor(Math.random() * techs.length)]

  let res = http.get(`${BASE_URL}/api/technologies/${tech}/nodes`)
  check(res, { 'graphe rechargé': r => r.status === 200 })

  if (res.status === 200) {
    const nodes = res.json('data')
    if (Array.isArray(nodes) && nodes.length > 0) {
      // Consulte 2 nœuds
      for (let i = 0; i < 2; i++) {
        sleep(1.5)
        const node = nodes[Math.floor(Math.random() * nodes.length)]
        const nodeRes = http.get(`${BASE_URL}/api/nodes/${node.id}`)
        check(nodeRes, { 'nœud consulté': r => r.status === 200 })
      }
    }
  }

  sleep(3)
}
