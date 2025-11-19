import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/DB/models/user.model';
import { Socket } from 'socket.io'

export interface SocketWithUsers extends Socket {
  user ?: User
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService : JwtService,
    @InjectModel(User.name) private readonly userModel : Model<User>,
  ){}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    const client : Socket = context.switchToWs().getClient()
    const authHeader = client.handshake.headers.authorization;
    if(!authHeader) throw new UnauthorizedException('Missing Anauthorized Header ...');
    
    const payload = await this.jwtService.verify(authHeader, {
      secret : process.env.ACCESS_SECRET_KEY,
    })
    const user = await this.userModel.findById(payload.userId)
    if(!user) throw new NotFoundException('User Not Found');
    
    (client as SocketWithUsers).user = user;

    return true;
  
  }

}
