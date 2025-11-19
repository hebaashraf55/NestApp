import { Module } from '@nestjs/common';
import { RealTimeGateWay } from './gateway';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/DB/models/user.model';

@Module({
    imports: [UserModel],
    providers: [ RealTimeGateWay , JwtService],
    controllers: []
})
export class GatewayModule {}
