// src/utils/asistenciasUtils.js

/**
 * Calcula las horas acumuladas a partir de una lista de asistencias
 * @param {Array} asistencias - Registros de asistencia [{hora_entrada, hora_salida}, ...]
 * @returns {Object} { totalHoras, horasEnteras, minutos }
 */
export function calcularHorasTotales(asistencias) {
  const totalHoras = asistencias.reduce((acc, registro) => {
    if (registro.hora_salida) {
      const horas = (new Date(registro.hora_salida) - new Date(registro.hora_entrada)) / (1000 * 60 * 60);
      return acc + horas;
    }
    return acc;
  }, 0);

  const horasEnteras = Math.floor(totalHoras);
  const minutos = Math.round((totalHoras - horasEnteras) * 60);

  return { totalHoras, horasEnteras, minutos };
}
