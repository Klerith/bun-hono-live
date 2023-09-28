import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

const registerMiddleware = zValidator('form', z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(3),
}));

const loginMiddleware = zValidator('form', z.object({
  email: z.string().email(),
  password: z.string().min(6),
}));



export const authRoutes = new Hono();

authRoutes.post('/login', loginMiddleware, async(c) => {

  const { email, password } = await c.req.parseBody() as any;
  const resp = await AuthService.login(email, password);

  return c.json(resp);

});

authRoutes.post('/register', registerMiddleware ,async(c) => {

  const { email, name, password } = await c.req.parseBody() as any;
  const resp = await AuthService.register(email, password, name);
  return c.json(resp);

});



