interface JwtPayload {
  sub: string
  email: string
  role: string
  abilities: string[]
  iat?: number
  exp?: number
}

interface RequestUser {
  uid: string
  email: string
  role: string
  abilities: string[]
}
