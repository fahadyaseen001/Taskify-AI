export const convertTo24Hour = (time12h: string): string => {
  if (!time12h) return '';
  
  const [time, modifier] = time12h.split(' ');
  const [hours, minutes] = time.split(':');
  
  let hourNumber = parseInt(hours);
  
  if (modifier === 'PM') {
    hourNumber = (hourNumber % 12 + 12);
  } else if (modifier === 'AM' && hourNumber === 12) {
    hourNumber = 0;
  }
  
  return `${hourNumber.toString().padStart(2, '0')}:${minutes}`;
};