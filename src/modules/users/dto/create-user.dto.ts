import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateUserDto {
    @Field()
    @IsString()
    name: string

    @Field()
    @IsEmail()
    email: string

    @Field()
    @IsOptional()
    password?: string
}