export function getFormattedDate(date) {
  return date.toISOString().slice(0, 10);
}

export function getAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let diffMs = today.getTime() - birthDate.getTime();

  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = Math.floor((diffDays % 365) % 30);

  return { years: years, months: months, days: days };
}
function convertDate(date) {
  const parts = date.split("/");
  return parts[2] + "-" + parts[1] + "-" + parts[0];
}
export function getAgeYear(birthday) {
  const birthDate = new Date(convertDate(birthday));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const birthdayMonth = birthDate.getMonth() + 1;
  if (birthdayMonth > currentMonth) age--;
  else if (currentMonth === birthdayMonth) {
    const currentDay = today.getDate();
    const currentDayBirth = birthDate.getDate();
    if (currentDayBirth > currentDay) age--;
  }
  return age;
}
