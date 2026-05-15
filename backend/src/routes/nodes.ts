import { Router } from 'express'
import { getNodeById } from '../controllers/nodesController'

const router = Router()
router.get('/:id', getNodeById)

export default router
