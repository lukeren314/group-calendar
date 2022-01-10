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

// function cleanGroupsJob() {
//   setTimeout(() => {
//     console.log("Cleaning groups");
//     groupsManager.cleanGroups();
//     cleanGroupsJob();
//   }, 1000 * 60 * 60 * 24 * 7);
// }
// cleanGroupsJob();

router.post("/new", async (req, res) => {
  const groupId = await groupsManager.createNewGroup();
  res.json({
    id: groupId,
  });
});

router.get("/:groupId/calendars", async (req, res) => {
  const groupId = req.params.groupId;
  if (!groupId) {
    console.log("Invalid request");
    res.send({
      status: false,
      message: "Invalid request",
    });
    return;
  }
  if (!(await groupsManager.hasGroup(groupId))) {
    res.json({});
    return;
  }
  await groupsManager.pingGroup(groupId);
  const calendars = await groupsManager.getCalendars(groupId);
  res.json(calendars);
});

router.post("/:groupId/uploadCalendar", async (req, res) => {
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
    if (!calendarFile || !req.body) {
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
    const groupId = req.params.groupId;
    const calendarName = req.body.name;
    const calendarPassword = req.body.password;
    if (!calendarName || calendarName.length == 0) {
      res.send({
        status: false,
        message: "Calendar needs a name!",
      });
      return;
    }
    if (calendarName.length > 256) {
      res.send({
        status: false,
        message: "Calendar name too long!",
      });
      return;
    }
    if (calendarPassword.length > 256) {
      res.send({
        status: false,
        message: "Calendar password too long!",
      });
      return;
    }
    await groupsManager.createGroupIfNotExists(groupId);
    if (await groupsManager.hasCalendarName(calendarName)) {
      console.log("Calendar with name already exists");
      res.send({
        status: false,
        message: "Calendar with name already exists",
      });
      return;
    }

    const calendarData = calendarFile.data.toString("utf8");
    const calendarEvents = parseCalendarString(calendarData);

    if (await groupsManager.calendarHasPassword(groupId, calendarName)) {
      if (!calendarPassword) {
        res.send({
          status: false,
          message: "Calendar has a password!",
        });
        return;
      }
      if (
        !await groupsManager.calendarPasswordMatches(
          groupId,
          calendarName,
          calendarPassword
        )
      ) {
        res.send({
          status: false,
          message: "Incorrect password!",
        });
        return;
      }
    }

    await groupsManager.createCalendar(
      groupId,
      calendarName,
      calendarPassword,
      calendarEvents
    );
    const calendars = await groupsManager.getCalendars(groupId);
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

// router.post("/:groupId/clearCalendars", (req, res) => {
//   try {
//     if (!await groupsManager.hasGroup(req.params.groupId)) {
//       console.log("Group not found");
//       res.send({
//         status: false,
//         message: "Group not found",
//       });
//       return;
//     }
//     const group = await groupsManager.getGroup(req.params.groupId);
//     group.clearCalendars();
//     groupsManager.saveGroups();
//     res.send({
//       status: true,
//       message: "Calendars cleared",
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send(err);
//   }
// });

router.post("/:groupId/deleteCalendar", async (req, res) => {
  try {
    if (!req.body || !req.body.name) {
      console.log("Invalid request");
      res.send({
        status: false,
        message: "Invalid request",
      });
      return;
    }
    const groupId = req.params.groupId;
    if (!(await groupsManager.hasGroup(groupId))) {
      console.log("Group not found");
      res.send({
        status: false,
        message: "Group not found",
      });
      return;
    }
    const calendarPassword = req.body.password;
    const calendarName = req.body.name;
    if (!(await groupsManager.hasCalendarName(groupId, calendarName))) {
      res.send({
        status: false,
        message: "Calendar doesn't exist!",
      });
      return;
    }
    if (await groupsManager.calendarHasPassword(groupId, calendarName)) {
      if (!calendarPassword) {
        res.send({
          status: false,
          message: "Calendar has a password!",
        });
        return;
      }
      if (
        !(await groupsManager.calendarPasswordMatches(
          groupId,
          calendarName,
          calendarPassword
        ))
      ) {
        res.send({
          status: false,
          message: "Incorrect password!",
        });
        return;
      }
    }
    await groupsManager.deleteCalendar(groupId, calendarName);
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
