import { jwt } from 'hono/jwt';
import { envs } from '../../config/envs';



export const authMiddleware = jwt({ secret: envs.JWT_SECRET }) 