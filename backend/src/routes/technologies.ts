import { Router } from 'express'
import { getAllTechnologies, getTechnologyById } from '../controllers/technologiesController'
import { getNodesByTechnology } from '../controllers/nodesController'

const router = Router()
router.get('/', getAllTechnologies)
router.get('/:id/nodes', getNodesByTechnology)
router.get('/:id', getTechnologyById)

export default router
