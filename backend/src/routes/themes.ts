import { Router } from 'express'
import { getAllThemes } from '../controllers/themesController'

const router = Router()
router.get('/', getAllThemes)

export default router
