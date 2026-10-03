// api.d.ts (runtime file)

export {}
declare global {
  namespace Typed {
    namespace Api {
      type Handle = {
        code: int
        type: 'error' | 'success'
        message: string
      }
      namespace Response {
        type Error = Handle & {
          cause: string[]
          timestamp: string
        }
        type Success<T> = Handle & {
          data: T
        }
      }
    }
  }
}
