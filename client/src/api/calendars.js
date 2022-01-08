export async function fetchCalendars(groupId) {
  const calendars = await fetch("/api/groups/" + groupId + "/calendars", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await calendars.json();
}

export async function fetchUploadCalendar(groupId, calendarFile, name) {
  const fd = new FormData();
  fd.append("calendar", calendarFile);
  fd.append("name", name);
  const response = await fetch(`/api/groups/${groupId}/uploadCalendar`, {
    method: "POST",
    body: fd,
  });
  return await response.json();
}

export async function fetchClearCalendars(groupId) {
  const response = await fetch(`/api/groups/${groupId}/clearCalendars`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}

export async function fetchDeleteCalendar(groupId, calendarId) {
  const data = {
    calendarId: calendarId,
  };
  const response = await fetch(`/api/groups/${groupId}/deleteCalendar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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
        const endDate = new Date(startDate.getTime() + event.duration);
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
