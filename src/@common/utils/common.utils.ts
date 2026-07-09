import { BaseException } from "../errors/base.exception"

export function parseJSON<T>(
  json: unknown,
  guard: (value: unknown) => value is T
): T | BaseException {
  try {
    if (typeof json !== 'string') {
      return new BaseException({
        cause: 'JSON PARSE ERROR: Cannot parse a non-string'
      })
    }

    const parsed: unknown = JSON.parse(json)

    if (!guard(parsed)) {
      return new BaseException({
        cause: 'JSON PARSE ERROR: parsed value failed the type guard'
      })
    }

    return parsed
  } catch (error) {
    return BaseException.fromUnknown(error, { messagePrefix: 'JSON PARSE: ' })
  }
}

export function defer(fn: () => void) {
  return {
    [Symbol.dispose]: fn,
  };
}

export function formatOutStock(disponivel: number) : string {
  return disponivel === 1 ? "Sim" : "Não";
} 

export function formatInStock(disponivel: string) : number {
  return disponivel === "S" ? 1 : 0;
}