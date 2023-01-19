import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuxService } from 'src/mux/mux.service';
import { LiveStreams } from 'src/typeorm';
import { Repository } from 'typeorm';
import { StreamCreateDto } from './dto/stream.create.dto';

@Injectable()
export class StreamService {
  constructor(
    private readonly muxService: MuxService,

    @InjectRepository(LiveStreams)
    private liveStreamsRep: Repository<LiveStreams>,
  ) {

  }

  async getLiveStreams() {
    const dbStrreams = await this.liveStreamsRep.find();

    return dbStrreams;

    // return this.muxService.getLiveStreams();
  }

  async getLiveStream(id: number) {
    const dbStrream = await this.liveStreamsRep.findOneBy({ id });

    return dbStrream;
  }

  async getLiveStreamToken(id: number) {
    const dbStrream = await this.liveStreamsRep.findOneBy({ id });

    return this.muxService.getJWTBySpaceId(dbStrream.spaceId);
  }

  async createLiveStream(streamCreateDto: StreamCreateDto) {
    const space = await this.muxService.createSpaceWithBroadcast();

    const liveStreamData: LiveStreams = {
      ...space,
      ...streamCreateDto,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    return await this.liveStreamsRep.save(liveStreamData);
  }

  async deleteLiveStream(liveStreamId: string) {
    return this.muxService.deleteLiveStream(liveStreamId);
  }
}
