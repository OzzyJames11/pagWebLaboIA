// src/utils/exportCsv.js
import { calcularHorasTotales } from './asistenciasUtils';
import { formatFullDate, formatTime } from './dateUtils';

export const exportUserAsCsv = (user, asistencias) => {
  if (!user || !Array.isArray(asistencias)) {
    console.error('Usuario o asistencias inválidos');
    return;
  }

  // --- Calcular total de horas y minutos ---
  const { totalHoras, horasEnteras, minutos } = calcularHorasTotales(asistencias);

  // --- Header de usuario ---
  const userHeader = [
    ['Nombre', user.nombre],
    ['Apellido', user.apellido],
    ['Código', user.id_usuario],
    ['Email', user.email],
    ['Rol', user.rol],
    ['Horario', user.horario]
  ];

  // --- Cabecera de la tabla de asistencias ---
  const asistenciaHeader = ['Fecha completa', 'Hora Entrada', 'Hora Salida', 'Horas trabajadas', 'Estado'];

  // --- Fila de total destacado ---
  const totalFila = [`TOTAL ACUMULADO: ${totalHoras.toFixed(2)} horas (${horasEnteras} horas y ${minutos} minutos)`, '', '', '', ''];

  // --- Filas de asistencias ---
  const asistenciaRows = asistencias.map(a => [
    formatFullDate(a.fecha),
    formatTime(a.hora_entrada),
    a.hora_salida ? formatTime(a.hora_salida) : '--',
    Number(a.horas_trabajadas).toFixed(2),
    a.estado
  ]);

  // --- Combinar todo en CSV ---
  let csvContent = '\uFEFF'; // BOM para UTF-8

  // Comentario inicial para mejorar presentación
  csvContent += '"INFORME DE USUARIO"\n';
  csvContent += `"Generado para: ${user.nombre} ${user.apellido} (Código: ${user.id_usuario})"\n`;
  csvContent += '\n';

  // Datos del usuario con separación visual
  userHeader.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(';') + '\n';
  });
  csvContent += '\n'; // línea vacía

  // Fila de total acumulado en mayúsculas para resaltar
  csvContent += totalFila.map(field => `"${field}"`).join(';') + '\n';

  // Cabecera de la tabla de asistencias
  csvContent += asistenciaHeader.map(field => `"${field}"`).join(';') + '\n';

  // Datos de asistencias
  asistenciaRows.forEach(row => {
    csvContent += row.map(field => `"${field}"`).join(';') + '\n';
  });

  // --- Nombre del archivo personalizado ---
  const safeNombre = user.nombre.replace(/\s+/g, '_');
  const safeApellido = user.apellido.replace(/\s+/g, '_');
  const safeCodigo = user.id_usuario;
  const fileName = `informe_${safeNombre}_${safeApellido}_${safeCodigo}.csv`;

  // --- Crear Blob y descargar ---
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
