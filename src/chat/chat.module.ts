import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';

@Module({
  imports: [],
  providers: [ChatService],
  exports: [ChatService]
})
export class ChatModule { }
