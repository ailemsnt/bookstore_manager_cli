import { BaseException } from '../errors/base.exception';

export function parseJSON<T>(
  json: unknown,
  guard: (value: unknown) => value is T,
): T | BaseException {
  try {
    if (typeof json !== 'string') {
      return new BaseException({
        cause: 'JSON PARSE ERROR: Cannot parse a non-string',
      });
    }

    const parsed: unknown = JSON.parse(json);

    if (!guard(parsed)) {
      return new BaseException({
        cause: 'JSON PARSE ERROR: parsed value failed the type guard',
      });
    }

    return parsed;
  } catch (error) {
    return BaseException.fromUnknown(error, { messagePrefix: 'JSON PARSE: ' });
  }
}

export function defer(fn: () => void) {
  return {
    [Symbol.dispose]: fn,
  };
}

export function formatOutChar(baixado: number): string {
  return baixado === 1 ? 'Sim' : 'Não';
}

export function formatInChar(baixado: string): number {
  return baixado === 'S' ? 1 : 0;
}

export function maskCpf(cpf: string): string {
  const cpfClean = cpf.replace(/\D/g, '');

  return cpfClean
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatDate(data: Date | string): string {
  const newDate = new Date(data);

  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getCurrentDate(): Date {
  return new Date();
}
