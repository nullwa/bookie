import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const Profile = createParamDecorator((_: unknown, ctx: ExecutionContext): Typed.Auth.Profile => {
  return ctx.switchToHttp().getRequest<Typed.Auth.AuthenticationRequest>().user
})
export { Profile }
