import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mux from "@mux/mux-node";
import { Video } from '@mux/mux-node/dist/video/video';

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

  retrieveLiveStreams = async (data, context) => {
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
      throw new Error(
        "Could not retrieve live streams",
      );
    }
  };

  retrieveLiveStream = async (data, context) => {
    try {
      const liveStreamId = data.liveStreamId;
      const liveStream = await this.Video.LiveStreams.get(liveStreamId);

      return liveStream;
    } catch (err) {
      console.error(
        `Unable to retrieve live stream, id: ${data.liveStreamId}. 
        Error ${err}`,
      );
      throw new Error(
        "Could not retrieve live stream",
      );
    }
  };

  deleteLiveStream = async (data, context) => {
    try {
      const liveStreamId = data.liveStreamId;
      const response = await this.Video.LiveStreams.del(liveStreamId);

      return response;
    } catch (err) {
      console.error(
        `Unable to delete live stream, id: ${data.liveStreamId}. 
      Error ${err}`,
      );
      throw new Error(
        "Could not delete live stream",
      );
    }
  };

  createSpaceWithBroadcast = async (data, context) => {
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

      const spaceToken = Mux.JWT.signSpaceId(space.id);

      return {
        spaceToken,
        spaceId: space.id,
        liveStreamId: liveStream.id,
        broadcastId: broadcast.id
      };
    } catch (err) {
      console.error(
        `Unable to create space ${context.auth.uid}. Error ${err}`,
      );

      throw new Error(
        "Could not create space",
      );
    }
  };

  startBroadcast = async (data, context) => {
    try {
      const response = await this.Video.Spaces.Broadcasts.start(data.spaceId, data.broadcastId);

      return response;
    } catch (err) {
      console.error(
        `Unable to start broadcast ${context.auth.uid}. Error ${err}`,
      );

      throw new Error(
        "Could not start broadcast",
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

  deleteSpace = async (data, context) => {
    try {
      const response = await this.Video.Spaces.delete(data.spaceId);

      return response;
    } catch (err) {
      console.error(
        `Unable to delete space ${context.auth.uid}. Error ${err}`,
      );

      throw new Error(
        "Could not delete space",
      );
    }
  };
}
