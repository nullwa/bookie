import { eSortDirection } from "@/_app/constants/enum"

/**
 * @description Parses a comma-separated string of fields and returns an array of trimmed field names,
 * typed as keys of a generic object type T.
 * @param input The comma-separated string to parse.
 * @returns An array of field names typed as (keyof T)[].
 */
export const parseParamValue = <T extends object>(input: string): (keyof T)[] => {
  if (!input || input.trim() === '') return []
  return input.split(',').map((field) => field.trim()).filter(Boolean) as (keyof T)[]
}

/**
 * @description Parses a comma-separated string of field:direction pairs and returns an object mapping fields to their respective sort directions. If a direction is not specified for a field, the default direction is used.
 * @param input 
 * @param defaultDirection 
 * @returns An object where keys are fields (keyof T) and values are sort directions (eSortDirection).
 */
export const parseOrderBy = <T extends object>(input: string, defaultDirection: eSortDirection = eSortDirection.DESC): Partial<Record<keyof T, eSortDirection>> => {
  if (!input?.trim()) return {}

  return input.split(',').reduce(
    (acc, item) => {
      const [field, direction] = item.trim().split(':')
      if (!field) return acc

      const dir = direction?.toUpperCase() as eSortDirection
      acc[field as keyof T] = Object.values(eSortDirection).includes(dir) ? dir : defaultDirection

      return acc
    },
    {} as Partial<Record<keyof T, eSortDirection>>,
  )
}

/**
 * @description Maps a given sort direction string to its corresponding 'ASC' or 'DESC' value. If the input is not provided or does not match 'ASC', it defaults to 'DESC'.
 * @param direction 
 * @returns 'ASC' if the input direction is 'asc' (case-insensitive), otherwise 'DESC'.
 */
export const mapSortDirection = (direction: eSortDirection): 'ASC' | 'DESC' => {
  if (!direction) return 'DESC'
  return direction.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
}

/**
 * @description Parses a comma-separated string of field:value pairs and returns an array of objects containing the field and value.
 * @param input
 * @returns An array of objects where each object has a 'field' key (keyof T) and a 'value' key (string).
 */
export const parseKeyValue = <T extends object>(input: string): { field: keyof T; value: string }[] => {
  if (!input?.trim()) return []

  return input.split(',').map(pair => {
    const [field, value] = pair.split(':').map(s => s.trim())
    if (!field || !value) return null

    return { field: field as keyof T, value }
  }).filter(Boolean) as { field: keyof T; value: string }[]
}