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
import { ChatService } from 'src/chat/chat.service';
import { ConfigService } from '@nestjs/config';

@ApiTags('streams')
@Controller('streams')
export class StreamController {
  private readonly logger = new Logger(StreamController.name);
  constructor(
    private readonly streamService: StreamService,
    private readonly subscriptionService: SubscriptionService,
    private readonly chatService: ChatService,
    private configService: ConfigService,
  ) { }

  @Post('/create')
  async createLiveStream(@Body() streamCreateDto: StreamCreateDto) {
    const stream = await this.streamService.createLiveStream(streamCreateDto);

    await this.chatService.createChannel(stream.ownerAddress, stream.id);

    return stream;
  }

  @Get('/chat/keys')
  async getChatKeys(@Query() query: any) {
    return {
      apiKey: this.chatService.getApiKey(),
      userToken: this.chatService.getUserToken(query.address),
    }
  }

  @Post('/:id/join-chat')
  async addUserToChat(@Param('id') streamId, @Query() query: any) {
    await this.chatService.addUserToChannel(query.address, streamId);

    return true;
  }

  @Post('/chat/create-user')
  async createChatUser(@Query() query: any) {
    await this.chatService.createUser(query.address, query.address);

    return {
      apiKey: this.chatService.getApiKey(),
      userToken: this.chatService.getUserToken(query.address),
    }
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
    const stream = await this.streamService.getLiveStream(streamId, query.address);

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

    hasSubscription = true;

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
      liked: stream.liked,
      totalLikes: stream.totalLikes
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

  // @Get('/:id/get-chat-user')
  // async startLiveStream(@Param('id') streamId) {
  //   return this.streamService.startLiveStream(streamId);
  // }

  @Post('/:id/like')
  async likeLiveStream(@Param('id') streamId, @Query() query: any) {
    return this.streamService.likeLiveStream(streamId, query.address);
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
