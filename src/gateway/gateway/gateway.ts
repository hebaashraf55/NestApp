import { UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from 'socket.io'
import { AuthGuard, SocketWithUsers } from "./auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/models/user.model";


@WebSocketGateway({ 
    cors: {
    origin :'*',
    } , 
    namespace: 'public' 
},)


export class RealTimeGateWay 
implements 
    OnGatewayConnection, 
    OnGatewayDisconnect 
    {       
        constructor(
            private readonly jwtService : JwtService, 
            @InjectModel(User.name) private readonly userModel : Model<User>,
        ){}
    async handleConnection(client: Socket) {
        console.log(`Client Connected : ${client.id}`);
    }
    handleDisconnect(client: Socket) {
        console.log(`Client Disconnected : ${client.id}`);   
    }

    @UseGuards(AuthGuard)
    @SubscribeMessage('sayHi')
    handleEvent(
        @MessageBody() data: string, 
        @ConnectedSocket() client : Socket ,
    ): string { 
        console.log({ data });
        client.emit('sayHi', 'Recived Data')
        return data;
    }


}