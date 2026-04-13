import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsNotEmpty, IsOptional, IsArray, IsString, IsNumber, ArrayMinSize, IsUrl, ValidateNested, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

// DTO: The BusinessCreateDto class defines the structure and validation rules for creating a new business.
export class BusinessCreateDto {
  /**
   * @description DTO: The slug of the business, which should be unique and is used for URL-friendly identifiers
   */
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string

  /**
   * @description DTO: The name of the business
   */
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string

  /**
   * @description DTO: The slogan of the business, which is a short and catchy phrase that represents the business's brand or mission
   */
  @IsString({ message: 'Slogan must be a string' })
  @IsNotEmpty({ message: 'Slogan is required' })
  slogan: string

  /**
   * @description DTO: The description of the business, which provides more detailed information about the business, its products, services, or values
   */
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string

  /**
   * @description DTO: The tax identification number of the business, which should be unique
   */
  @IsString({ message: 'Tax identification number must be a string' })
  @IsNotEmpty({ message: 'Tax identification number is required' })
  taxIdentificationNumber: string

  /**
   * @description DTO: A boolean flag indicating whether the business can have a loyalty program
   */
  @IsOptional()
  @IsBoolean({ message: 'canHaveLoyaltyProgram must be a boolean' })
  canHaveLoyaltyProgram?: boolean

  /**
   * @description DTO: The address is an optional object that represents the address information for the business. It must be of type AddressDto if provided.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: Partial<AddressDto>

  /**
   * @description DTO: The contact is an optional object that represents the contact information for the business. It must be of type ContactDto if provided.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => ContactDto)
  contact?: Partial<ContactDto>
}

// DTO: The BusinessUpdateDto class extends the BusinessCreateDto, making all properties optional for update operations.
export class BusinessUpdateDto extends PartialType(BusinessCreateDto) {}

// DTO: The AddressDto class defines the structure and validation rules for creating a new address.
class AddressDto {
  /**
   * @description DTO: The first line of the address (e.g., street number and name)
   */
  @IsString({ message: 'Line 1 must be a string' })
  @IsNotEmpty({ message: 'Line 1 is required' })
  line1: string

  /**
   * @description DTO: The second line of the address (e.g., apartment, suite, floor)
   */
  @IsOptional()
  @IsString({ message: 'Line 2 must be a string' })
  line2?: string

  /**
   * @description DTO: The city of the address
   */
  @IsString({ message: 'City must be a string' })
  @IsNotEmpty({ message: 'City is required' })
  city: string

  /**
   * @description DTO: The state or province of the address
   */
  @IsOptional()
  @IsString({ message: 'State must be a string' })
  state?: string

  /**
   * @description DTO: The postal/zip code of the address
   */
  @IsString({ message: 'Postal code must be a string' })
  @IsNotEmpty({ message: 'Postal code is required' })
  postalCode: string

  /**
   * @description DTO: The country of the address (ISO 3166-1 alpha-2 code, e.g., "TN", "US")
   */
  @IsString({ message: 'Country must be a string' })
  @IsNotEmpty({ message: 'Country is required' })
  country: string

  /**
   * @description DTO: The latitude coordinate for geo/map features
   */
  @IsOptional()
  @IsNumber({}, { message: 'Latitude must be a number' })
  latitude?: number

  /**
   * @description DTO: The longitude coordinate for geo/map features
   */
  @IsOptional()
  @IsNumber({}, { message: 'Longitude must be a number' })
  longitude?: number
}

// DTO: The ContactDto class defines the structure and validation rules for creating a new contact.
class ContactDto {
  /**
   * @description DTO: The email of the contact, which should be unique for each contact
   */
  @IsEmail()
  email: string

  /**
   * @description DTO: The phone numbers of the contact, stored as an array of strings. This allows for multiple phone numbers to be associated with a single contact.
   */
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one phone number is required' })
  @IsString({ each: true, message: 'Each phone number must be a string' })
  phone: string[]

  /**
   * @description DTO: The website URL of the contact, which is optional and can be null
   */
  @IsOptional()
  @IsUrl({}, { message: 'Website must be a valid URL' })
  website: string

  /**
   * @description DTO: The WhatsApp link of the contact, which is optional and can be null
   */
  @IsOptional()
  @IsUrl({}, { message: 'WhatsApp link must be a valid URL' })
  whatappLink: string
}
