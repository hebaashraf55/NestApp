import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { MongooseModule } from '@nestjs/mongoose';
import { PreAuthMiddleware } from './common/middleware/preAuth.middleware';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CouponModule } from './coupon/coupon.module';
import { OrderModule } from './order/order.module';
import { PaymentService } from './common/Services/payment/payment.service';
import { GatewayModule } from './gateway/gateway/gateway.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.dev'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      onConnectionCreate: (connection) => {
        connection.on('connected', () =>
          console.log('DB Is Connected Successfully'),
        );
      },
    }),
    BrandModule,
    CategoryModule,
    ProductModule,
    CartModule,
    CouponModule,
    OrderModule,
    GatewayModule
  ],
  controllers: [AppController],
  providers: [AppService, PaymentService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PreAuthMiddleware).forRoutes();
  }
}
