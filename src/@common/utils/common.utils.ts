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

export function formatOutChar(disponivel: number) : string {
  return disponivel === 1 ? "Sim" : "Não";
} 

export function formatInChar(disponivel: string) : number {
  return disponivel === "S" ? 1 : 0;
}

export function maskCpf(cpf: string): string {
  const cpfClean = cpf.replace(/\D/g,'');
  
  return cpfClean.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

export function formatDate(data: Date | string): string {
  const newDate = new Date(data);

  const day = String(newDate.getDate()).padStart(2, '0');
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const year = newDate.getFullYear();

  return `${day}/${month}/${year}`;
}

export function getStatusBorrowBook(dataPrevistaEntrega: Date): string {
  const dataAtual = new Date();
  dataAtual.setHours(0, 0, 0, 0);

  const prevista = new Date(dataPrevistaEntrega);
  prevista.setHours(0, 0, 0, 0);

  const diasAtraso = Math.floor(
    (dataAtual.getTime() - prevista.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (diasAtraso > 0
    ? `**Em atraso há ${diasAtraso} dia(s)**`
    : 'Em dia');
}