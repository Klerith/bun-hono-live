import { Hono } from 'hono';
import { prisma } from '../../data';
import { authMiddleware } from '../middlewares/auth.middleware';
import { decode } from 'hono/jwt';


export const userRoutes = new Hono();
console.log( __dirname);
console.log(  import.meta.dir  );



// userRoutes.get('/', authMiddleware  ,async(c) => {
userRoutes.get('/' ,async(c) => {

  
  const token = c.req.header('Authorization')?.split(' ').at(1) ?? '';
  const { header, payload } = decode(token)


  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    }
  });

  return c.json({
    header,
    payload,
    token,
    users,
  });

});




