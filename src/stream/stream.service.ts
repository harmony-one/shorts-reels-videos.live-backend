import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MuxService } from 'src/mux/mux.service';
import { LiveStreams } from 'src/typeorm';
import { Likes } from 'src/typeorm';
import { Repository } from 'typeorm';
import { StreamCreateDto } from './dto/stream.create.dto';

@Injectable()
export class StreamService {
  private muxLiveStreams = [];

  constructor(
    private readonly muxService: MuxService,

    @InjectRepository(LiveStreams)
    private liveStreamsRep: Repository<LiveStreams>,

    @InjectRepository(Likes)
    private likesRep: Repository<Likes>,
  ) {
    setInterval(async () => {
      this.muxLiveStreams = await this.muxService.getLiveStreams();
    }, 3000);
  }

  async getLiveStreams() {
    const dbStrreams = await this.liveStreamsRep.find();

    return dbStrreams.map(dbStream => {
      const muxLiveStream = this.muxLiveStreams.find(stream => stream.id === dbStream.liveStreamId);

      return {
        ...dbStream,
        status: muxLiveStream?.status,
        playbackId: muxLiveStream?.playback_ids[0]?.id
      }
    });
  }

  async getLiveStream(id: number, userAddress?: string) {
    const dbStream = await this.liveStreamsRep.findOneBy({ id });

    const muxLiveStream = this.muxLiveStreams.find(stream => stream.id === dbStream.liveStreamId);

    let liked = false;

    if (userAddress) {
      try {
        liked = !!(await this.likesRep.findOneBy({ streamId: id, userAddress }));
      } catch (e) { }
    }

    let totalLikes = 0;
    
    try {
    totalLikes = await this.likesRep.count({ where: { streamId: id } });
    } catch (e) {
      // console.error(e);
    }

    return {
      ...dbStream,
      status: muxLiveStream?.status,
      playbackId: muxLiveStream?.playback_ids[0]?.id,
      liked,
      totalLikes
    };
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

  async deleteLiveStream(id: number) {
    const stream = await this.getLiveStream(id);

    try {
      await this.muxService.deleteLiveStream(stream.liveStreamId);
    } catch (e) {
      console.error(e);
    }

    try {
      await this.muxService.deleteSpace(stream.spaceId);
    } catch (e) {
      console.error(e);
    }

    const dbStrream = await this.liveStreamsRep.findOneBy({ id });

    return await this.liveStreamsRep.delete(dbStrream);
  }

  async startLiveStream(liveStreamId: number) {
    const stream = await this.getLiveStream(liveStreamId);

    return this.muxService.startBroadcast(stream);
  }

  async likeLiveStream(streamId: number, userAddress: string) {
    return await this.likesRep.save({
      streamId,
      userAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
