import { useEffect, useState } from "react";
import Modal from "../Components/Modals/Modal";
import InputForm from "../Components/Inputs/InputForm";
import { registrarTransaccion } from "../Services/Controllers/Transaccion";
import ButtonForm from "../Components/Buttons/ButtonForm";
import SelectForm from "../Components/Inputs/SelectForm";

// Función para obtener la fecha local
const obtenerFechaLocal = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate()); // Aseguramos que sea el día actual
  return fecha.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
};

// Función para convertir fecha a formato local
const convertirAFechaLocal = (fechaString) => {
  if (!fechaString) return '';
  const fecha = new Date(fechaString);
  fecha.setDate(fecha.getDate()); // Aseguramos que sea el día correcto
  return fecha.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD
};

const NuevaTransac = ({ isOpen, onClose, cuentas, onActualizarCuentas }) => {
  const estadoInicial = {
    monto: "",
    detalle: "",
    tipo_transaccion: "",
    fecha: obtenerFechaLocal(),
    cuenta: { cuenta_id: "" },
    moneda: { moneda_id: "" }
  };

  const [transaccion, setTransaccion] = useState(estadoInicial);
  const [errores, setErrores] = useState({});
  const [success, setSuccess] = useState(false);
  const [saldoActual, setSaldoActual] = useState(null);

  const resetFormulario = () => {
    setTransaccion(estadoInicial);
    setErrores({});
    setSaldoActual(null);
  };

  useEffect(() => {
    if (!isOpen) resetFormulario();
  }, [isOpen]);

  const validarFormulario = () => {
    let nuevosErrores = {};
    const montoNumerico = Number(transaccion.monto);

    if (!transaccion.monto) {
      nuevosErrores.monto = "El monto es obligatorio";
    } else {
      if (montoNumerico <= 0) {
        nuevosErrores.monto = "El monto debe ser mayor a 0";
      }
      if (montoNumerico > 10000000) {
        nuevosErrores.monto = "El monto no puede superar 1,000,000";
      }
      if (!Number.isInteger(montoNumerico * 100)) {
        nuevosErrores.monto = "El monto no puede tener más de 2 decimales";
      }
    }

    
    if (!transaccion.detalle.trim()) {
      nuevosErrores.detalle = "El detalle es obligatorio";
    } else if (transaccion.detalle.length < 3) {
      nuevosErrores.detalle = "El detalle debe tener al menos 3 caracteres";
    } else if (transaccion.detalle.length > 100) {
      nuevosErrores.detalle = "El detalle no puede superar los 100 caracteres";
    }



    if (!transaccion.tipo_transaccion) {
      nuevosErrores.tipo_transaccion = "Debe seleccionar un tipo de transacción";
    }

    if (!transaccion.cuenta.cuenta_id) {
      nuevosErrores.cuenta_id = "Debe seleccionar una cuenta";
    }

    if (
      transaccion.cuenta.cuenta_id &&
      ["Retiro", "Pago", "Transferencia"].includes(transaccion.tipo_transaccion)
    ) {
      const cuentaSeleccionada = cuentas.find(
        (c) => c.cuenta_id === Number(transaccion.cuenta.cuenta_id)
      );
      if (cuentaSeleccionada && montoNumerico > cuentaSeleccionada.saldo) {
        nuevosErrores.monto = `Saldo insuficiente. Saldo actual: ${formatearNumero(cuentaSeleccionada.saldo)}, Monto requerido: ${formatearNumero(montoNumerico)}`;
      }
    }

    if (!transaccion.fecha) {
      nuevosErrores.fecha = "La fecha es obligatoria";
    } else {
      const [year, month, day] = transaccion.fecha.split('-');
      const fechaTransaccion = new Date(year, month - 1, day);

      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);

      const fechaLimite = new Date();
      fechaLimite.setMonth(fechaLimite.getMonth() - 1);
      fechaLimite.setHours(0, 0, 0, 0);

      if (fechaTransaccion > fechaActual) {
        nuevosErrores.fecha = "No se pueden registrar transacciones con fecha futura";
      } else if (fechaTransaccion < fechaLimite) {
        nuevosErrores.fecha = "No se pueden registrar transacciones con más de 30 días de antigüedad";
      }
    }

    return nuevosErrores;
  };

  const handleCuentaChange = (e) => {
    const cuentaId = e.target.value;
    const cuentaSeleccionada = cuentas.find(c => c.cuenta_id === Number(cuentaId));

    if (cuentaSeleccionada) {
      setSaldoActual(cuentaSeleccionada.saldo);
    } else {
      setSaldoActual(null);
    }

    setTransaccion({
      ...transaccion,
      cuenta: { cuenta_id: cuentaId },
      moneda: { moneda_id: cuentaSeleccionada ? cuentaSeleccionada.moneda.moneda_id : "" }
    });
    setErrores(prev => ({ ...prev, cuenta_id: "", monto: "" }));
  };

  const handleMontoChange = (e) => {
    const valor = e.target.value;
    if (valor === "" || /^\d*\.?\d{0,2}$/.test(valor)) {
      setTransaccion({ ...transaccion, monto: valor });

      if (
        saldoActual !== null &&
        ["Retiro", "Pago", "Transferencia"].includes(transaccion.tipo_transaccion)
      ) {
        const montoNumerico = Number(valor);
        if (montoNumerico > saldoActual) {
          setErrores(prev => ({
            ...prev,
            monto: `Saldo insuficiente. Saldo actual: ${formatearNumero(saldoActual)}, Monto requerido: ${formatearNumero(montoNumerico)}`
          }));
        } else {
          setErrores(prev => ({ ...prev, monto: "" }));
        }
      } else {
        setErrores(prev => ({ ...prev, monto: "" }));
      }
    }
  };

  const handleTipoTransaccionChange = (e) => {
    const nuevoTipo = e.target.value;
    setTransaccion({ ...transaccion, tipo_transaccion: nuevoTipo });

    if (
      saldoActual !== null &&
      ["Retiro", "Pago", "Transferencia"].includes(nuevoTipo) &&
      transaccion.monto
    ) {
      const montoNumerico = Number(transaccion.monto);
      if (montoNumerico > saldoActual) {
        setErrores(prev => ({
          ...prev,
          monto: `Saldo insuficiente. Saldo actual: ${formatearNumero(saldoActual)}, Monto requerido: ${formatearNumero(montoNumerico)}`
        }));
      } else {
        setErrores(prev => ({ ...prev, tipo_transaccion: "" }));
      }
    }
  };

  const Registrar = async (e) => {
    e.preventDefault();
    setSuccess(false);
    const nuevosErrores = validarFormulario();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const fechaSeleccionada = new Date(transaccion.fecha);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1); // Ajustamos la fecha
      const fechaFormateada = fechaSeleccionada.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD

      const datosTransaccion = {
        ...transaccion,
        monto: Number(transaccion.monto),
        detalle: transaccion.detalle,
        fecha: fechaFormateada,
        cuenta: { cuenta_id: Number(transaccion.cuenta.cuenta_id) },
        moneda: { moneda_id: Number(transaccion.moneda.moneda_id) }
      };

      console.log("Datos enviados:", datosTransaccion);
      let rsp = await registrarTransaccion(datosTransaccion);

      if (rsp) {
        console.log("Respuesta del servidor:", rsp);
        setSuccess(true);
        onActualizarCuentas();
        resetFormulario();

        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error al registrar la transacción:", error);
      setErrores({ api: error.message || "Hubo un error al registrar la transacción" });
    }
  };

  function formatearNumero(num) {
    const numero = parseFloat(num);
    if (isNaN(numero)) return '0.00';
    return numero.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nueva Transacción">
      <form onSubmit={Registrar} className="space-y-4">
        {errores.api && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errores.api}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Transacción registrada exitosamente
          </div>
        )}

        <InputForm
          label="Monto"
          type="number"
          name="monto"
          value={transaccion.monto}
          onChange={handleMontoChange}
          placeHolder="Ingrese el monto"
          min="0.01"
          step="0.01"
        />
        {errores.monto && <p className="text-red-500 text-sm">{errores.monto}</p>}

        <InputForm
          label="Detalle"
          type="text"
          name="detalle"
          value={transaccion.detalle}
          onChange={(e) => {
            setTransaccion({ ...transaccion, detalle: e.target.value });
            setErrores(prev => ({ ...prev, detalle: "" }));
          }}
          placeHolder="Ingrese el detalle"
        />
        {errores.detalle && <p className="text-red-500 text-sm">{errores.detalle}</p>}

        <div className="flex flex-col m-2 form-group">
          <SelectForm
            label="Tipo de Transacción"
            titleOption="Seleccione un tipo"
            name="tipo_transaccion"
            value={transaccion.tipo_transaccion}
            onChange={handleTipoTransaccionChange}
            options={[
              { value: "Cobro", label: "Cobro" },
              { value: "Deposito", label: "Deposito" },
              { value: "Retiro", label: "Retiro" },
              { value: "Transferencia", label: "Transferencia" },
              { value: "Pago", label: "Pago" },
            ]}
          />
          {errores.tipo_transaccion && <p className="text-red-500 text-sm">{errores.tipo_transaccion}</p>}

          <SelectForm
            label="Cuenta"
            titleOption="Seleccione una cuenta"
            name="cuenta_id"
            value={transaccion.cuenta.cuenta_id}
            onChange={handleCuentaChange}
            options={cuentas.map((cuenta) => ({
              value: cuenta.cuenta_id,
              label: `${cuenta.alias} - (Saldo: ${formatearNumero(cuenta.saldo)})`,
            }))}
          />
          {errores.cuenta_id && <p className="text-red-500 text-sm">{errores.cuenta_id}</p>}
        </div>

        <div className="form-group relative">
          <InputForm
            label="Moneda de la cuenta"
            type="text"
            readOnly={true}
            value={
              transaccion.cuenta.cuenta_id
                ? `$ ${cuentas.find(c => c.cuenta_id === Number(transaccion.cuenta.cuenta_id))?.moneda.nombre}`
                : ""
            }
          />
        </div>

        <InputForm
          label="Fecha"
          type="date"
          name="fecha"
          value={transaccion.fecha}
          onChange={(e) => {
            const fechaSeleccionada = e.target.value;
            setTransaccion({ ...transaccion, fecha: fechaSeleccionada });
            setErrores(prev => ({ ...prev, fecha: "" }));
          }}
          min={(() => {
            const fechaMin = new Date();
            fechaMin.setMonth(fechaMin.getMonth() - 1);
            return convertirAFechaLocal(fechaMin.toISOString());
          })()}
          max={obtenerFechaLocal()}
        />
        {errores.fecha && <p className="text-red-500 text-sm">{errores.fecha}</p>}

        <div className="flex justify-end space-x-4">
          <ButtonForm
            text="Cancelar"
            type="button"
            onClick={onClose}
            className="bg-white text-red-600 border-red-600 hover:bg-red-600 hover:text-white hover:border-white"
          />
          <ButtonForm
            text="Guardar"
            className="bg-white text-[#2da0ad] border-2 border-[#2da0ad] hover:bg-[#2da0ad] hover:text-white hover:border-white transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-md"
            onClick={Registrar}
          />
        </div>
      </form>
    </Modal>
  );
};

export default NuevaTransac;
