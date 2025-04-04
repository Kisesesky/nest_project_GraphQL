import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class JoinRoomDto {
    @Field({ nullable: true })
    roomId: number

    @Field({ nullable: true })
    name?: string

    @Field()
    participantId: string
}
