
CREATE TABLE Groups (
    group_id text PRIMARY KEY,
    last_modified bigint
);

CREATE TABLE Calendars (
    calendar_id SERIAL PRIMARY KEY,
    calendar_name text,
    calendar_password text,
    group_id text REFERENCES Groups(group_id)
);

CREATE TABLE Events (
    event_id SERIAL PRIMARY KEY,
    day_of_week int,
    start_hour int,
    start_minute int,
    duration int,
    calendar_id int REFERENCES Calendars(calendar_id)
)