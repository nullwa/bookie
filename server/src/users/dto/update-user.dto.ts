import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { eUserAbility } from '@/_app/constants/enum';
import { IsArray, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
 /**
   * @description DTO: The abilities of the user, which is a many-to-many relationship with the Ability entity
   */
  @IsArray()
  @IsOptional()
  @IsEnum(eUserAbility, {each:true, message:'this ability is not valid'} )
  abilities: eUserAbility[]  
}
