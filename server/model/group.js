class Group {
  constructor(id, calendars = {}) {
    this.id = id;
    this.calendars = calendars;
    this.lastModified = Date.now();
  }
  getCalendars() {
    return this.calendars;
  }
  updateCalendar(name, password, events) {
    for (let calendarId in this.calendars) {
      if (this.calendars[calendarId].name === name) {
        if (this.calendars[calendarId].password === password) {
          this.calendars[calendarId].events = events;
        }
        return;
      }
    }
    const id = this.generateCalendarId();
    this.calendars[id] = {
      id,
      name,
      password,
      events,
    };
  }
  hasCalendarName(name) {
    for (let calendarId in this.calendars) {
      if (this.calendars[calendarId].name === name) {
        return true;
      }
    }
    return false;
  }
  calendarNameHasPassword(name) {
    for (let calendarId in this.calendars) {
      if (this.calendars[calendarId].name === name && this.calendarHasPassword(calendarId)) {
        return true;
      }
    }
    return false;
  }
  calendarHasPassword(calendarId) {
    return calendarId in this.calendars && this.calendars[calendarId].password !== "";
  }
  calendarPasswordMatches(calendarId, password) {
    return this.calendars[calendarId].password === password;
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
    // patch from previous version without passwords
    for (let calendarId in this.calendars) {
      if (!("password" in this.calendars[calendarId])) {
        this.calendars[calendarId].password = "";
      }
    }
    this.lastModified = json.lastModified;
    return this;
  }
}

module.exports = Group;
