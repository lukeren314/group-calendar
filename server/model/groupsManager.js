// const Group = require("./group");
// const fs = require("fs");
const {
  hasGroupId,
  createGroup,
  pingGroup,
  getCalendars,
  createCalendar,
  deleteCalendar,
  hasCalendarName,
  calendarHasPassword,
  calendarPasswordMatches,
} = require("./database");

class GroupsManager {
  constructor(dataPath) {
    this.dataPath = dataPath;
  }
  async createNewGroup() {
    const id = await this.generateId();
    await this.createGroup(id);
    return id;
  }
  async createGroupIfNotExists(groupId) {
    if (!(await this.hasGroup(groupId))) {
      this.createGroup(groupId);
    }
  }
  async createGroup(groupId) {
    await createGroup(groupId, Date.now());
  }
  async pingGroup(groupId) {
    await pingGroup(groupId, Date.now());
  }
  async hasGroup(groupId) {
    return await hasGroupId(groupId);
  }
  async hasCalendarName(groupId, calendarName) {
    return await hasCalendarName(groupId, calendarName);
  }
  async getCalendars(groupId) {
    return await getCalendars(groupId);
  }
  async calendarHasPassword(groupId, calendarName) {
    return await calendarHasPassword(groupId, calendarName);
  }
  async calendarPasswordMatches(groupId, calendarName, calendarPassword) {
    return await calendarPasswordMatches(groupId, calendarName, calendarPassword);
  }
  async createCalendar(
    groupId,
    calendarName,
    calendarPassword,
    calendarEvents
  ) {
    await createCalendar(
      groupId,
      calendarName,
      calendarPassword,
      calendarEvents
    );
  }
  async deleteCalendar(groupId, calendarName) {
    await deleteCalendar(groupId, calendarName);
  }
  // cleanGroups() {
  //   for (let groupId in this.groups) {
  //     // if not modified in 100 days
  //     if (
  //       this.groups[groupId].lastModified + 1000 * 60 * 60 * 24 * 100 <
  //         Date.now() ||
  //       Object.keys(this.groups[groupId].getCalendars()).length === 0
  //     ) {
  //       delete this.groups[groupId];
  //     }
  //   }
  // }
  async generateId() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    while (await hasGroupId(id)) {
      id = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    return id;
  }
  // saveGroups() {
  //   const content = JSON.stringify(this.groups);
  //   fs.writeFile(this.dataPath, content, (err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  // }
  // loadGroups() {
  //   try {
  //     if (!fs.existsSync(this.dataPath)) {
  //       return;
  //     }
  //     const data = fs.readFileSync(this.dataPath, "utf8");
  //     const json = JSON.parse(data);
  //     this.groups = {};
  //     for (let key in json) {
  //       this.groups[key] = new Group().fromJson(json[key]);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
}

module.exports = GroupsManager;
