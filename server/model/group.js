class Group {
  constructor(id, calendars = {}) {
    this.id = id;
    this.calendars = calendars;
    this.lastModified = Date.now();
  }
  getCalendars() {
    return this.calendars;
  }
  updateCalendar(name, events) {
    for (let calendarId in this.calendars) {
      if (this.calendars[calendarId].name == name) {
        this.calendars[calendarId].events = events;
        return;
      }
    }
    const id = this.generateCalendarId();
    this.calendars[id] = {
      id,
      name,
      events,
    };
  }
  deleteCalendar(calendarId) {
    if (calendarId in this.calendars) {
      delete this.calendars[calendarId];
    }
  }
  clearCalendars() {
    this.calendars = {};
  }
  generateCalendarId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  ping() {
    this.lastModified = Date.now();
  }
  lastModified() {
    return this.lastModified;
  }
  fromJson(json) {
    this.id = json.id;
    this.calendars = json.calendars;
    this.lastModified = json.lastModified;
    return this;
  }
}

module.exports = Group;
