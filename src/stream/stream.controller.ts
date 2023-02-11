import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { ApiTags } from '@nestjs/swagger';
import { StreamCreateDto } from './dto/stream.create.dto';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('streams')
@Controller('streams')
export class StreamController {
  private readonly logger = new Logger(StreamController.name);
  constructor(
    private readonly streamService: StreamService,
    private readonly subscriptionService: SubscriptionService,
    private configService: ConfigService,
  ) { }

  @Post('/create')
  async createLiveStream(@Body() streamCreateDto: StreamCreateDto) {
    return this.streamService.createLiveStream(streamCreateDto);
  }

  @Get('/list')
  async getLiveStreams() {
    const list = await this.streamService.getLiveStreams();

    return list.map(l => ({
      id: l.id,
      status: l.status,
      title: l.title,
      name: l.name,
      aliasName: l.aliasName,
      ownerAddress: l.ownerAddress,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
    }));
  }

  @Get('/:id')
  async getLiveStream(@Param('id') streamId, @Query() query: any) {
    const stream = await this.streamService.getLiveStream(streamId);

    let hasSubscription = false;

    if (stream) {
      try {
        hasSubscription = await this.subscriptionService.checkUserSubscription({
          user: query.address,
          name: stream.name,
          aliasName: stream.aliasName
        });
      } catch (e) {
        this.logger.error(e);
      }
    }

    return ({
      id: stream.id,
      status: stream.status,
      title: stream.title,
      name: stream.name,
      aliasName: stream.aliasName,
      ownerAddress: stream.ownerAddress,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
      hasSubscription,
      playbackId: hasSubscription ? stream.playbackId : null,
    })
  }

  @Post('/:id/pay')
  async getPaymentLink(@Param('id') streamId, @Body() body, @Req() req: any) {
    const stream = await this.streamService.getLiveStream(streamId);

    return this.subscriptionService.getPaymentLink({
      amount: 50,
      params: {
        user: body.address,
        name: stream.name,
        aliasName: stream.aliasName,
        paidAt: 12345,
      },
      successUrl: `${this.configService.get('frontend.url')}/streams/${streamId}`,
      cancelUrl: `${this.configService.get('frontend.url')}/streams/${streamId}/rejected`
    });
  }

  @Get('/:id/token')
  async getLiveStreamToken(@Param('id') streamId) {
    return this.streamService.getLiveStreamToken(streamId);
  }

  @Post('/:id/start')
  async startLiveStream(@Param('id') streamId) {
    return this.streamService.startLiveStream(streamId);
  }

  @Post('/:id/delete')
  async deleteLiveStream(@Param('id') streamId) {
    return this.streamService.deleteLiveStream(streamId);
  }
}
