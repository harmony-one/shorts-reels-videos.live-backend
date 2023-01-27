import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
