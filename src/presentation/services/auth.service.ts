import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { prisma } from '../../data';
import { envs } from '../../config/envs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  }
}


export class AuthService {

  static async createJwt( payload: Object ) {
    return sign(payload, envs.JWT_SECRET )
  }


  static async login( email: string, password: string ):Promise<LoginResponse> {

    const user = await prisma.user.findFirst({
      where: { email }
    });

    if ( !user ) {
      throw new HTTPException(400, { message: 'Email or password incorrect - Email' })
    }

    const isMatch = Bun.password.verifySync(password, user.password);

    if ( !isMatch ) {
      throw new HTTPException(400, { message: 'Email or password incorrect - Password' })
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: await AuthService.createJwt({ id: user.id })
    }
  }



  static async register( email: string, password: string, name: string ):Promise<LoginResponse> {

    const existEmail = await prisma.user.findFirst({
      where: { email }
    });

    if ( existEmail ) {
      throw new HTTPException(400, {  message: 'Email already exists' })
    }

    const user = await prisma.user.create({
      data: {
        email: email,
        password: Bun.password.hashSync(password),
        name: name,
      }
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: await AuthService.createJwt({ id: user.id })
    };

  }

  


}