import {
  Controller,
  Get,
  Logger,
  Query,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserSubscribeDto } from './dto/user.subscribe.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('/subscribe')
  async subscribe(@Res() res, @Query() dto: UserSubscribeDto) {
    const { ownerAddress, subscriberAddress } = dto;

    // if (ownerAddress === subscriberAddress) {
    //   throw new BadRequestException(
    //     'subscriberAddress should be different from ownerAddress',
    //   );
    // }

    const isUserSubscribed = await this.userService.isUserSubscribed(
      ownerAddress,
      subscriberAddress,
    );
    if (isUserSubscribed) {
      // throw new BadRequestException('User already subscribed');
    }

    // await this.userService.subscribe(dto);
  }
}
