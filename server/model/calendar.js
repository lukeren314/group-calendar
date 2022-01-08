const ICAL = require("ical.js");

function parseCalendarString(calendarStr) {
  let calendarEvents = [];
  const eventSet = new Set();
  try {
    const calendarComponent = new ICAL.Component(new ICAL.parse(calendarStr));
    const subComponents = calendarComponent.getAllSubcomponents();
    subComponents.forEach(function (subComponent) {
      const event = new ICAL.Event(subComponent);
      if (event.summary.includes("Final")) {
        return;
      }
      const expand = event.iterator();
      let next;
      while ((next = expand.next())) {
        const date = next.toJSDate();
        const calendarEvent = {
          dayOfWeek: next.dayOfWeek() - 1,
          startHour: date.getHours(),
          startMinute: date.getMinutes(),
          duration: event.duration.toSeconds() * 1000,
        };
        const id = `${calendarEvent.dayOfWeek}-${calendarEvent.startHour}-${calendarEvent.startMinute}-${calendarEvent.duration}`;
        if (eventSet.has(id)) {
          return;
        }
        eventSet.add(id);
        calendarEvents.push(calendarEvent);
      }
    });
  } catch (e) {
    console.log(e);
  }
  return calendarEvents;
}
module.exports = parseCalendarString;
