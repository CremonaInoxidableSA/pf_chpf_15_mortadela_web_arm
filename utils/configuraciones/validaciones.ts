interface Torre {
  id: string;
}

export const validacionesConfiguraciones = {
  existeTorreConTAG: (tag: string, torres: Torre[]): boolean => {
    return torres.some((torre) => torre.id === tag);
  },
  validarNumeroEntero: (valor: string): number | null => {
    const numero = parseInt(valor);

    return isNaN(numero) ? null : numero;
  },
  limpiarInputNumerico: (valor: string): string => {
    return valor.includes(".") ? valor.split(".")[0] : valor;
  },
  validarTAG: (tag: string): string => {
    return tag.toUpperCase();
  },
  procesarValoresInput: (
    inputRefs: (HTMLInputElement | null)[],
    cantidadEsperada: number,
  ) => {
    const inputValues: (number | string | null)[] = [];

    inputRefs.forEach((input) => {
      if (input) {
        const value = input.value.trim();

        inputValues.push(
          value === "" ? null : isNaN(Number(value)) ? value : Number(value),
        );
      }
    });

    while (inputValues.length < cantidadEsperada) {
      inputValues.push(null);
    }

    return inputValues;
  },

  crearObjetoCorrecciones: (
    cantidad: number,
    indice?: number,
    valor: number = 0,
  ) => {
    const correcciones: { [key: string]: number | null } = {};

    for (let i = 1; i <= cantidad; i++) {
      correcciones[`Correcion${i}`] =
        indice !== undefined && i === indice + 1 ? valor : null;
    }

    return correcciones;
  },
};
