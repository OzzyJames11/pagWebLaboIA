import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatFullDate = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
};

export const formatTime = (dateString) => {
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'HH:mm');
};