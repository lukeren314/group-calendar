const Group = require("./group");
const fs = require("fs");

class GroupsManager {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.groups = {};
  }
  createTemporaryGroup() {
    const id = this.generateGroupId();
    return new Group(id);
  }
  createNewGroup() {
    const id = this.generateGroupId();
    return this.createGroup(id);
  }
  getGroupOrCreate(groupId) {
    if (!(groupId in this.groups)) {
      return this.createGroup(groupId);
    }
    return this.getGroup(groupId);
  }
  createGroup(groupId) {
    this.groups[groupId] = new Group(groupId);
    return this.groups[groupId];
  }
  getGroup(groupId) {
    this.groups[groupId].ping();
    return this.groups[groupId];
  }
  getGroups() {
    return this.groups;
  }
  hasGroup(groupId) {
    return groupId in this.groups;
  }
  cleanGroups() {
    for (let groupId in this.groups) {
      // if not modified in 100 days
      if (
        this.groups[groupId].lastModified + 1000 * 60 * 60 * 24 * 100 <
          Date.now() ||
          Object.keys(this.groups[groupId].getCalendars()).length === 0
      ) {
        delete this.groups[groupId];
      }
    }
  }
  generateGroupId() {
    const id = Math.random().toString(36).substring(2, 8).toUpperCase();
    while (id in this.groups) {
      id = Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    return id;
  }
  saveGroups() {
    const content = JSON.stringify(this.groups);
    fs.writeFile(this.dataPath, content, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
  loadGroups() {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return;
      }
      const data = fs.readFileSync(this.dataPath, "utf8");
      const json = JSON.parse(data);
      this.groups = {};
      for (let key in json) {
        this.groups[key] = new Group().fromJson(json[key]);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = GroupsManager;
