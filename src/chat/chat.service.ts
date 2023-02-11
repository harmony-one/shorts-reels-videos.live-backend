import { Injectable } from '@nestjs/common';
import { StreamChat } from 'stream-chat';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
    chatSDK: StreamChat;

    constructor(private configService: ConfigService) {
        this.chatSDK = StreamChat.getInstance(
            configService.get('streamChat.apiKey'),
            configService.get('streamChat.apiSecret'),
        );
    }

    getUserToken = async (user) => {
        const token = this.chatSDK.createToken(
            user,
            Math.floor(Date.now() / 1000) + (60 * 60)
        );

        return token;
    }

    createChannel = async (owner, channelId) => {
        const channel = this.chatSDK.channel('livestream', channelId, {
            members: [owner],
            created_by_id: owner
        });

        const newChannel = await channel.create();

        return newChannel;
    }

    addUserToChannel = async (userName, channelId) => {
        const channel = this.chatSDK.getChannelById('livestream', channelId, {});

        await channel.addMembers([userName]);

        return true;
    }

    createUser = async (id, name) => {
        return await this.chatSDK.upsertUser({ id, name });
    }
}
