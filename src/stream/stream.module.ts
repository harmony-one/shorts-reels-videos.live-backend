import { Module } from '@nestjs/common';
import { StreamService } from './stream.service';
import { StreamController } from './stream.controller';
import { MuxModule } from 'src/mux/mux.module';
import { Likes, LiveStreams } from 'src/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    MuxModule,
    TypeOrmModule.forFeature([LiveStreams]),
    TypeOrmModule.forFeature([Likes]),
    SubscriptionModule
  ],
  providers: [StreamService],
  controllers: [StreamController],
})
export class StreamModule { }
