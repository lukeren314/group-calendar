const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  post: process.env.PG_PORT,
});

async function hasGroupId(groupId) {
  const res = await queryDB("SELECT * FROM Groups WHERE group_id=$1", [
    groupId,
  ]);
  return res.rows.length > 0;
}

async function createGroup(groupId, lastModified) {
  await queryDB("INSERT INTO Groups(group_id, last_modified) VALUES($1, $2)", [
    groupId,
    lastModified,
  ]);
}

async function getCalendars(groupId) {
  const calendarData = await getCalendarData(groupId);
  const calendars = {};
  for (let calendar of calendarData.rows) {
    const eventData = await queryDB(
      "SELECT * FROM Events WHERE calendar_id = $1",
      [calendar.calendar_id]
    );
    const events = [];
    for (let event of eventData.rows) {
      events.push({
        dayOfWeek: event.day_of_week,
        startHour: event.start_hour,
        startMinute: event.start_minute,
        duration: event.duration,
      });
    }
    calendars[calendar.calendar_id] = {
      id: calendar.calendar_id,
      name: calendar.calendar_name,
      password: calendar.calendar_password,
      events: events,
    };
  }
  return calendars;
}

async function getCalendarData(groupId) {
  return await queryDB("SELECT * FROM Calendars WHERE group_id=$1", [groupId]);
}

async function pingGroup(groupId) {
  await queryDB("UPDATE Groups SET last_modified = $1 WHERE group_id = $2", [
    Date.now(),
    groupId,
  ]);
}

async function hasCalendarName(groupId, calendarName) {
  const res = await queryDB(
    "SELECT * FROM Calendars WHERE group_id = $1 AND calendar_name = $2",
    [groupId, calendarName]
  );
  return res.rows.length > 0;
}
async function calendarHasPassword(groupId, calendarName) {
  const res = await queryDB(
    "SELECT * FROM Calendars WHERE group_id = $1 AND calendar_name = $2",
    [groupId, calendarName]
  );
  return res.rows.length > 0 && res.rows[0].calendar_password.length > 0;
}

async function calendarPasswordMatches(
  groupId,
  calendarName,
  calendarPassword
) {
  const res = await queryDB(
    "SELECT * FROM Calendars WHERE group_id = $1 AND calendar_name = $2 AND calendar_password = $3",
    [groupId, calendarName, calendarPassword]
  );
  return res.rows.length > 0;
}

async function createCalendar(
  groupId,
  calendarName,
  calendarPassword,
  calendarEvents
) {
  const calendar = await queryDB(
    "INSERT INTO Calendars(calendar_name, calendar_password, group_id) VALUES ($1, $2, $3) RETURNING *",
    [calendarName, calendarPassword, groupId]
  );
  const calendarId = calendar.rows[0].calendar_id;
  for (let event of calendarEvents) {
    await queryDB(
      "INSERT INTO Events(day_of_week, start_hour, start_minute, duration, calendar_id) VALUES ($1, $2, $3, $4, $5)",
      [
        event.dayOfWeek,
        event.startHour,
        event.startMinute,
        event.duration,
        calendarId,
      ]
    );
  }
}

async function deleteCalendar(groupId, calendarName) {
  const res = await queryDB(
    "SELECT * FROM Calendars WHERE calendar_name = $1",
    [calendarName]
  );
  if (res.rows.length == 0) {
    return;
  }
  const calendarId = res.rows[0].calendar_id;
  await queryDB("DELETE FROM Events WHERE calendar_id = $1", [calendarId]);
  await queryDB(
    "DELETE FROM Calendars WHERE group_id = $1 AND calendar_id = $2",
    [groupId, calendarId]
  );
}

async function queryDB(query, values = [], onError = null) {
  try {
    const res = await pool.query(query, values);
    // if (endPool) {
    //   await pool.end();
    // }
    return res;
  } catch (err) {
    console.log(err.stack);
  }
  return onError;
}

module.exports = {
  hasGroupId,
  createGroup,
  getCalendars,
  pingGroup,
  createCalendar,
  deleteCalendar,
  hasCalendarName,
  calendarHasPassword,
  calendarPasswordMatches,
};
