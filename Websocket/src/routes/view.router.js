import { Router } from 'express';
import ViewController from '../controllers/ViewController.js';

const viewRouter = Router();

viewRouter.get('', ViewController.home)
viewRouter.get('/realtimeproducts', ViewController.realtimeproducts)

export default viewRouter;