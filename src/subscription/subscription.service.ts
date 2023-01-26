import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventTrackerService } from 'src/event-tracker/event-tracker.service';
import EventEmitter from 'events';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private eventTracker: EventTrackerService;

  constructor(private configService: ConfigService) {
    console.log(configService);

    const eventEmitter = new EventEmitter();

    this.eventTracker = new EventTrackerService({
      contractAbi: {} as any,
      contractAddress: configService.get('web3.subscriptionsContractAddress'),
      rpcUrl: configService.get('web3.rpcUrl'),
      eventEmitter,
    });

    this.eventTracker.start();
  }
}
