import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator'

// #region imports
import { Enum } from '@/common/enums'
// #endregion

const IsIdentifierValid = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isIdentifierValid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(identifier: unknown, args: ValidationArguments) {
          const obj = args.object as { provider: Typed.Auth.Provider }

          if (typeof identifier !== 'string' || identifier.length === 0) return false

          switch (obj.provider) {
            case Enum.Auth.Provider.EMAIL:
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)
            case Enum.Auth.Provider.PHONE:
              return /^\+?[1-9]\d{1,14}$/.test(identifier)
            case Enum.Auth.Provider.GOOGLE:
              return identifier.length > 0
            default:
              return false
          }
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as { provider: Typed.Auth.Provider }
          return `identifier is invalid for provider "${obj.provider}"`
        },
      },
    })
  }
}
export { IsIdentifierValid }
