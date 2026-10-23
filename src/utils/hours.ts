/**
 * Helper to determine if the salon is currently open based on Casablanca time (UTC+1)
 * Monday–Saturday: 10:00–20:00
 * Sunday: 11:00–20:00
 */
export function getSalonOpenStatus(): {
  isOpen: boolean;
  statusText: string;
  nextOpenText: string;
  todayIndex: number; // 0: Dimanche, 1: Lundi, 2: Mardi, 3: Mercredi, 4: Jeudi, 5: Vendredi, 6: Samedi
  todayDayName: string;
  todayHoursText: string;
} {
  const now = new Date();
  
  // Format current Casablanca time
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Casablanca',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const parts = formatter.formatToParts(now);
  
  let hour = now.getHours();
  let minute = now.getMinutes();
  let weekdayStr = '';

  for (const part of parts) {
    if (part.type === 'hour') hour = parseInt(part.value, 10);
    if (part.type === 'minute') minute = parseInt(part.value, 10);
    if (part.type === 'weekday') weekdayStr = part.value.toLowerCase();
  }

  // Determine today index based on weekday in Casablanca
  let dayIndex = now.getDay();
  if (weekdayStr.includes('dim')) dayIndex = 0;
  else if (weekdayStr.includes('lun')) dayIndex = 1;
  else if (weekdayStr.includes('mar')) dayIndex = 2;
  else if (weekdayStr.includes('mer')) dayIndex = 3;
  else if (weekdayStr.includes('jeu')) dayIndex = 4;
  else if (weekdayStr.includes('ven')) dayIndex = 5;
  else if (weekdayStr.includes('sam')) dayIndex = 6;

  const dayNames = [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ];
  const todayDayName = dayNames[dayIndex];
  const currentMinutes = hour * 60 + minute;

  // Sunday: 11:00 - 20:00
  if (dayIndex === 0) {
    const openMinutes = 11 * 60; // 11:00
    const closeMinutes = 20 * 60; // 20:00
    const todayHoursText = "11:00 – 20:00";

    if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
      return {
        isOpen: true,
        statusText: "Ouvert actuellement",
        nextOpenText: "Ferme ce soir à 20h00",
        todayIndex: 0,
        todayDayName,
        todayHoursText,
      };
    } else if (currentMinutes < openMinutes) {
      return {
        isOpen: false,
        statusText: "Fermé actuellement",
        nextOpenText: "Ouvre aujourd'hui à 11h00",
        todayIndex: 0,
        todayDayName,
        todayHoursText,
      };
    } else {
      return {
        isOpen: false,
        statusText: "Fermé actuellement",
        nextOpenText: "Ouvre demain lundi à 10h00",
        todayIndex: 0,
        todayDayName,
        todayHoursText,
      };
    }
  }

  // Monday - Saturday: 10:00 - 20:00
  const openMinutes = 10 * 60; // 10:00
  const closeMinutes = 20 * 60; // 20:00
  const todayHoursText = "10:00 – 20:00";

  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: "Ouvert actuellement",
      nextOpenText: "Ferme ce soir à 20h00",
      todayIndex: dayIndex,
      todayDayName,
      todayHoursText,
    };
  } else if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      statusText: "Fermé actuellement",
      nextOpenText: "Ouvre aujourd'hui à 10h00",
      todayIndex: dayIndex,
      todayDayName,
      todayHoursText,
    };
  } else {
    const isSaturday = dayIndex === 6;
    return {
      isOpen: false,
      statusText: "Fermé actuellement",
      nextOpenText: isSaturday ? "Ouvre demain dimanche à 11h00" : "Ouvre demain à 10h00",
      todayIndex: dayIndex,
      todayDayName,
      todayHoursText,
    };
  }
}
