import { Hono } from 'hono';
import { authRoutes } from './presentation/auth/routes';
import { userRoutes } from './presentation/users/routes';
import { authMiddleware } from './presentation/middlewares/auth.middleware';

const app = new Hono();

app.get('/', (c) => c.text('Hono!'));

app.use('/api/users', authMiddleware );


app.route('/api/auth', authRoutes );
app.route('/api/users', userRoutes );

export default app