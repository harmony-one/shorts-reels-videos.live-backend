import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const Mux = require("@mux/mux-node");
import { Video } from '@mux/mux-node/dist/video/video';
import { ISpace } from './types';

@Injectable()
export class MuxService {
  private Video: Video;

  constructor(private configService: ConfigService) {
    const mux = new Mux(
      configService.get('mux.tokenId'),
      configService.get('mux.tokenSecret'),
    );

    this.Video = mux.Video;
  }

  createLiveStream = async (data, context) => {
    try {
      const response = await this.Video.LiveStreams.create({
        playback_policy: "public",
        new_asset_settings: { playback_policy: "public" },
      });

      return response;
    } catch (err) {
      console.error(
        `Unable to start the live stream ${context.auth.uid}. 
        Error ${err}`,
      );
      throw new Error(
        "Could not create live stream",
      );
    }
  };

  getLiveStreams = async () => {
    try {
      const liveStreams = await this.Video.LiveStreams.list({});

      const responseList = liveStreams.map((liveStream) => ({
        id: liveStream.id,
        status: liveStream.status,
        playback_ids: liveStream.playback_ids,
        created_at: liveStream.created_at,
      }));

      return responseList;
    } catch (err) {
      console.error(
        `Unable to retrieve live streams. 
        Error ${err}`,
      );
      // throw new Error(
      //   "Could not retrieve live streams",
      // );
    }
  };

  getLiveStream = async (liveStreamId) => {
    try {
      const liveStream = await this.Video.LiveStreams.get(liveStreamId);

      return liveStream;
    } catch (err) {
      console.error(
        `Unable to retrieve live stream, id: ${liveStreamId}. 
        Error ${err}`,
      );
      throw new Error(
        "Could not retrieve live stream",
      );
    }
  };

  deleteLiveStream = async (liveStreamId) => {
    try {
      const response = await this.Video.LiveStreams.del(liveStreamId);

      return response;
    } catch (err) {
      console.error(
        `Unable to delete live stream, id: ${liveStreamId}. 
      Error ${err}`,
      );
      throw new Error(
        "Could not delete live stream",
      );
    }
  };

  getJWTBySpaceId = (spaceId: string) => Mux.JWT.signSpaceId(spaceId);

  createSpaceWithBroadcast = async (): Promise<ISpace> => {
    try {
      const space = await this.Video.Spaces.create({});

      const liveStream = await this.Video.LiveStreams.create({
        playback_policy: "public",
        latency_mode: 'low',
        new_asset_settings: { playback_policy: "public" },
      });

      const broadcast = await this.Video.Spaces.Broadcasts.create(space.id, {
        live_stream_id: liveStream.id,
        layout: 'active-speaker'
        // passthrough?: string;
        // resolution?: BroadcastResolution;
      });

      // const spaceToken = Mux.JWT.signSpaceId(space.id);

      return {
        spaceId: space.id,
        liveStreamId: liveStream.id,
        broadcastId: broadcast.id
      };
    } catch (err) {
      console.error(
        `Unable to create space. Error ${err}`,
      );

      throw new Error(
        "Could not create space",
      );
    }
  };

  startBroadcast = async (data) => {
    try {
      const response = await this.Video.Spaces.Broadcasts.start(data.spaceId, data.broadcastId);

      return response;
    } catch (err) {
      console.error(
        `Unable to start broadcast. Error ${err.message}`,
      );

      throw new Error(
        err.message,
      );
    }
  };

  stopBroadcast = async (data, context) => {
    try {
      const response = await this.Video.Spaces.Broadcasts.stop(data.spaceId, data.broadcastId);

      return response;
    } catch (err) {
      console.error(
        `Unable to stop broadcast ${context.auth.uid}. Error ${err}`,
      );

      throw new Error(
        "Could not stop broadcast",
      );
    }
  };

  deleteSpace = async (spaceId) => {
    try {
      const response = await this.Video.Spaces.delete(spaceId);

      return response;
    } catch (err) {
      console.error(
        `Unable to delete space. Error ${err}`,
      );

      throw new Error(
        "Could not delete space",
      );
    }
  };
}
