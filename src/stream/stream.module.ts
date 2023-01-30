import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { MuxModule } from 'src/mux/mux.module';
import { LiveStreams } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [MuxModule, TypeOrmModule.forFeature([LiveStreams]), SubscriptionModule],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule { }
