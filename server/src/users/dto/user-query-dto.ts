import { IsNumber, IsOptional, IsString, Min } from "class-validator"
import { Type } from 'class-transformer'

// DTO: The RequestUserQueryDto class defines the structure and validation rules for querying users with pagination, sorting, and filtering options.
export class RequestUserQueryDto {
  /**
   * @description DTO: The page number for pagination. Must be a positive integer. Default is 1.
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1

  /**
   * @description DTO: The number of items to return per page for pagination. Must be a positive integer with a minimum value of 10. Default is 25.
   */
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(10, { message: 'Limit must be at least 10' })
  limit: number = 25

  /**
   * @description DTO: The sorting order for the results. Must be either 'asc' for ascending or 'desc' for descending. Default is 'desc'.
   */
  @IsOptional()
  @IsString()
  sort: string

  /**
   * @description DTO: A search term to filter the results. This is an optional string that can be used to perform a search query on the user data.
   */
  @IsOptional()
  @IsString()
  search: string

  /**
   * @description DTO: A comma-separated list of fields to include in the response. This is an optional string that specifies which fields of the user data should be included in the response. If not provided, all fields will be included.
   */
  @IsOptional()
  @IsString()
  fields: string

  /**
   * @description DTO: A comma-separated list of related entities to include in the response. This is an optional string that specifies which related entities (e.g., posts, comments) should be included in the response. If not provided, no related entities will be included.
   */
  @IsOptional()
  @IsString()
  include: string
}