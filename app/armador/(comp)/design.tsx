import Rack from "./rackArmador";

const DatosDelCiclo = [
  { id: 1, nombre: "ESTADO FINAL", dato: "FINALIZADO CON CANCELACIONES" },
  { id: 2, nombre: "TIPO DE CORTE REALIZADO", dato: "MORTADELA LARGA" },
  { id: 3, nombre: "KILOGRAMOS DE PRODUCTO PROCESADO", dato: "nn KG" },
  { id: 4, nombre: "NIVELES POSIBLES", dato: "n NIVELES" },
  { id: 5, nombre: "RACK PROCESADO", dato: "PF-1239-A2" },
  { id: 6, nombre: "TIEMPO TOTAL", dato: "hh:mm:ss" },
  { id: 7, nombre: "TIEMPO DE CICLO EN PAUSA", dato: "hh:mm:ss" },
];

const DatosDelRack = [
  { id: 1, nombre: "NIVEL SELECCIONADO FINAL", dato: "Nivel 13" },
  { id: 2, nombre: "RESULTADO", dato: "PROCESADO CORRECTAMENTE" },
  { id: 3, nombre: "TIEMPO DE PROCESO", dato: "mm:ss" },
];

const Cancelaciones = [
  { id: 1, dato: "1. Cancelacion manual" },
  { id: 2, dato: "2. Posicionador falla" },
  { id: 3, dato: "3. Corte mal posicionado" },
  { id: 4, dato: "4. Error en sistema de control" },
  { id: 5, dato: "5. Fallo en alimentador" },
  { id: 6, dato: "6. Error en sistema de medición" },
  { id: 7, dato: "7. Problema en sistema de iluminación" },
];

export default function DatosLateralesArmado() {
  return (
    <div className="bg-background2 flex flex-row gap-5 p-4 rounded-md h-200 w-full">
      <div className="flex flex-col justify-between gap-5 rounded-md w-1/4">
        <div className="bg-background3 p-2 rounded-md h-1/5">
          Selector Fecha
        </div>

        <div className="bg-background3 p-2 rounded-md h-4/5">
          Selector Ciclo
        </div>
      </div>

      <div className="flex flex-col bg-background3 justify-between gap-2 p-5 rounded-md w-1/4">
        <div>DATOS DEL CICLO</div>
        {DatosDelCiclo.map((dato) => (
          <div
            className="bg-background4 py-1 px-3 rounded-md flex flex-col flex-1 justify-evenly"
            key={dato.id}
          >
            <div>{dato.nombre}</div>
            <div>{dato.dato}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col bg-background3 justify-between gap-2 p-5 rounded-md w-1/4">
        <div>DATOS DEL RACK</div>
        {DatosDelRack.map((dato) => (
          <div
            className="bg-background4 py-1 px-3 rounded-md flex flex-col flex-1 justify-evenly"
            key={dato.id}
          >
            <div>{dato.nombre}</div>
            <div>{dato.dato}</div>
          </div>
        ))}
        <div className="flex flex-col justify-between gap-2 rounded-md h-1/2">
          <div>
            <p>CANCELACIONES</p>
            <p className="text-orange">n CANCELACIONES EN ESTE NIVEL</p>
          </div>
          <div className="bg-background4 flex flex-col rounded-md overflow-hidden h-full p-2">
            <div className="flex flex-col gap-2 overflow-y-auto rounded-md">
              {Cancelaciones.map((dato) => (
                <div
                  className="bg-background5 py-1 px-3 rounded-md"
                  key={dato.id}
                >
                  <div>{dato.dato}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Rack />
    </div>
  );
}
