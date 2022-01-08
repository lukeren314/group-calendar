const fs = require("fs");
const express = require("express");
const router = express.Router();
const parseCalendarString = require("../model/calendar");
const GroupsManager = require("../model/groupsManager");

const DATA_DIR = "./data";
const DATA_PATH = DATA_DIR + "/groups.json";

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
} catch (err) {
  console.log(err);
}
const groupsManager = new GroupsManager(DATA_PATH);
groupsManager.loadGroups();

function cleanGroupsJob() {
  setTimeout(() => {
    groupsManager.cleanGroups();
    cleanGroupsJob();
  }, 1000 * 60 * 60 * 24 * 7);
}
cleanGroupsJob();

router.post("/new", (req, res) => {
  const group = groupsManager.createTemporaryGroup();
  res.json(group);
});

router.get("/groups", (req, res) => {
  res.json(groupsManager.getGroups());
});

router.get("/:groupId/calendars", (req, res) => {
  if (!groupsManager.hasGroup(req.params.groupId)) {
    res.json({});
    return;
  }
  
  const calendars = groupsManager
    .getGroup(req.params.groupId)
    .getCalendars();
  res.json(calendars);
});

router.post("/:groupId/uploadCalendar", (req, res) => {
  try {
    if (!req.files) {
      console.log("No file uploaded");
      res.send({
        status: false,
        message: "No file uploaded",
      });
      return;
    }
    const calendarFile = req.files.calendar;
    if (!calendarFile || !req.body || !req.body.name) {
      console.log("Invalid request");
      res.send({
        status: false,
        message: "Invalid request",
      });
      return;
    }
    if (calendarFile.mimetype !== "text/calendar") {
      console.log("Wrong file type");
      res.send({
        status: false,
        message: "Wrong file type",
      });
      return;
    }
    const calendarData = calendarFile.data.toString("utf8");
    const calendarEvents = parseCalendarString(calendarData);

    const group = groupsManager.getGroupOrCreate(req.params.groupId);
    group.updateCalendar(req.body.name, calendarEvents);
    const calendars = group.getCalendars();
    groupsManager.saveGroups();
    console.log("File is uploaded");
    //send response
    res.send({
      status: true,
      message: "File is uploaded",
      data: {
        name: calendarFile.name,
        mimetype: calendarFile.mimetype,
        size: calendarFile.size,
        calendars: calendars,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/:groupId/clearCalendars", (req, res) => {
  try {
    if (!groupsManager.hasGroup(req.params.groupId)) {
      console.log("Group not found");
      res.send({
        status: false,
        message: "Group not found",
      });
      return;
    }
    const group = groupsManager.getGroup(req.params.groupId);
    group.clearCalendars();
    groupsManager.saveGroups();
    res.send({
      status: true,
      message: "Calendars cleared",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post("/:groupId/deleteCalendar", (req, res) => {
  try {
    if (!req.body || !req.body.calendarId) {
      console.log("Invalid request");
      res.send({
        status: false,
        message: "Invalid request",
      });
      return;
    }
    if (!groupsManager.hasGroup(req.params.groupId)) {
      console.log("Group not found");
      res.send({
        status: false,
        message: "Group not found",
      });
      return;
    }
    const group = groupsManager.getGroup(req.params.groupId);
    group.deleteCalendar(req.body.calendarId);
    groupsManager.saveGroups();
    res.send({
      status: true,
      message: "Calendars cleared",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

module.exports = router;
