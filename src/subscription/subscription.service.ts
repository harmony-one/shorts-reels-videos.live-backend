import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventTrackerService } from 'src/event-tracker/event-tracker.service';
import { EventEmitter } from "events";
import { abi } from '../abi/ShortsReelsVideos';
import { Web3Service } from "nest-web3";
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import axios from 'axios';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);
  private eventTracker: EventTrackerService;

  private subscriptionContract: Contract;

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

    const web3 = this.web3Service.getClient();

    this.subscriptionContract = new web3.eth.Contract(
      abi as AbiItem[],
      configService.get('web3.subscriptionsContractAddress'),
    );
  }

  checkUserSubscription = async (props: { user: string, name: string, aliasName: string }) => {
    return this.subscriptionContract.methods.checkVideoVanityURLAccess(
      props.user, props.name, props.aliasName
    ).call();
  }

  getPaymentLink = async (props: {
    amount: string;
    params: {
      user: string;
      name: string;
      aliasName: string;
    }
    successUrl: string;
    cancelUrl: string;
  }) => {
    const res = await axios.post(
      `${this.configService.get('paymentService.url')}/stripe/checkout/video/pay`,
      props
    );

    return res.data;
  }
}
