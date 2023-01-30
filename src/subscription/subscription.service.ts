import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventTrackerService } from 'src/event-tracker/event-tracker.service';
import { EventEmitter } from "events";
import { abi } from '../abi/ShortsReelsVideos';
import { Web3Service } from "nest-web3";

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private eventTracker: EventTrackerService;

  constructor(
    private configService: ConfigService,
    private readonly web3Service: Web3Service
  ) {
    const eventEmitter = new EventEmitter();

    this.eventTracker = new EventTrackerService({
      contractAbi: abi,
      contractAddress: configService.get('web3.subscriptionsContractAddress'),
      rpcUrl: configService.get('web3.rpcUrl'),
      eventEmitter,
    }, this.web3Service);

    // this.eventTracker.start();

    eventEmitter.on('VideoVanityURLPaid', (res) => {
      // console.log(res);
    });
  }
}
