import { SetMetadata } from "@nestjs/common";

export const ABILITIES_KEY = 'abilities'
export const Abilities = (...abilities: string[]) => SetMetadata(ABILITIES_KEY, abilities)