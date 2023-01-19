import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { ApiTags } from '@nestjs/swagger';
import { StreamCreateDto } from './dto/stream.create.dto';

@ApiTags('streams')
@Controller('streams')
export class StreamController {
  private readonly logger = new Logger(StreamController.name);
  constructor(
    private readonly streamService: StreamService,
  ) { }

  @Get('/list')
  async getLiveStreams() {
    return this.streamService.getLiveStreams();
  }

  @Post('/create')
  async createLiveStream(@Body() streamCreateDto: StreamCreateDto) {
    return this.streamService.createLiveStream(streamCreateDto);
  }

  @Get('/:id')
  async getLiveStream(@Param('id') streamId) {
    return this.streamService.getLiveStream(streamId);
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
