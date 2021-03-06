import { getApiHost } from "./api";

export async function fetchCalendars(groupId) {
  const calendars = await fetch(
    getApiHost("/groups/" + groupId + "/calendars"),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await calendars.json();
}

const cipher = (salt) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return (text) =>
    text.split("").map(textToChars).map(applySaltToChar).map(byteHex).join("");
};
const encrypt = cipher("foobar123");

function encryptPassword(password) {
  if (!password) {
    return password;
  }
  return encrypt(password);
}

export async function fetchUploadCalendar(
  groupId,
  calendarFile,
  name,
  password
) {
  const fd = new FormData();
  fd.append("calendar", calendarFile);
  fd.append("name", name);
  fd.append("password", encryptPassword(password));
  const response = await fetch(
    getApiHost(`/groups/${groupId}/uploadCalendar`),
    {
      method: "POST",
      body: fd,
    }
  );
  return await response.json();
}

// export async function fetchClearCalendars(groupId) {
//   const response = await fetch(getApiHost(`/groups/${groupId}/clearCalendars`), {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//   return await response.json();
// }

export async function fetchDeleteCalendar(groupId, calendarName, password) {
  const data = {
    name: calendarName,
    password: encryptPassword(password),
  };
  const response = await fetch(
    getApiHost(`/groups/${groupId}/deleteCalendar`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  return await response.json();
}

const colors = [
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1",
];

export function extractEvents(calendars) {
  let calendarI = 0;
  return Object.values(calendars).reduce((events, calendar) => {
    events.push(
      ...calendar.events.map((event) => {
        const date = new Date();
        date.setHours(event.startHour);
        date.setMinutes(event.startMinute);
        const startDate = new Date(
          date.getTime() + (event.dayOfWeek - date.getDay()) * 86400000
        );
        const endDate = new Date(
          startDate.getTime() + parseInt(event.duration)
        );
        const calendarEvent = {
          id: calendar.id,
          name: calendar.name,
          start: `${startDate.toISOString().substring(0, 10)} ${startDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${startDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          end: `${startDate.toISOString().substring(0, 10)} ${endDate
            .getHours()
            .toString()
            .padStart(2, "0")}:${endDate
            .getMinutes()
            .toString()
            .padStart(2, "0")}`,
          color: colors[calendarI % colors.length],
          password: calendar.password,
        };
        console.log(calendarEvent);
        return calendarEvent;
      })
    );
    calendarI++;
    return events;
  }, []);
}

export default fetchCalendars;
