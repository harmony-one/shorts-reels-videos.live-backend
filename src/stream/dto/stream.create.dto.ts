import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StreamCreateDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    ownerAddress: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;
}
