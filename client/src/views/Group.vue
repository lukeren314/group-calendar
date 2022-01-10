<template>
  <div class="group">
    <h1>Group Code: {{ $route.params.id }}</h1>
    <v-container fluid>
      <v-row>
        <v-col>
          <v-text-field
            label="Name"
            :rules="rules"
            hide-details="auto"
            v-model="name"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            label="Password (optional)"
            hide-details="auto"
            v-model="password"
            type="password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          ><v-btn @click="openUploadDialogue">Upload Calendar</v-btn>
          <FileUpload
            :isOpen="uploadDialogue"
            @close="closeUploadDialogue"
            @file-uploaded="uploadCalendar"
          />
        </v-col>
        <!-- <v-col><v-btn @click="clearCalendars">Clear Calendars</v-btn></v-col> -->
      </v-row>
    </v-container>

    <Calendar :events="events" @delete="deleteEvent" />
  </div>
</template>

<script>
import FileUpload from "../components/FileUpload.vue";
import Calendar from "../components/Calendar.vue";
import {
  fetchCalendars,
  fetchUploadCalendar,
  // fetchClearCalendars,
  fetchDeleteCalendar,
  extractEvents,
} from "../api/calendars";

export default {
  name: "Group",
  components: {
    FileUpload,
    Calendar,
  },
  async created() {
    this.loadCalendars();
  },
  methods: {
    openUploadDialogue() {
      this.uploadDialogue = true;
    },
    closeUploadDialogue() {
      this.uploadDialogue = false;
    },
    async uploadCalendar(calendarFile) {
      const response = await fetchUploadCalendar(
        this.$route.params.id,
        calendarFile,
        this.name,
        this.password
      );
      console.log(response);
      if (!response.status) {
        this.$emit("openSnackbar", response.message);
        return;
      }
      await this.loadCalendars();
    },
    async loadCalendars() {
      const calendars = await fetchCalendars(this.$route.params.id);
      console.log(calendars);
      this.events = extractEvents(calendars);
    },
    // async clearCalendars() {
    //   const response = await fetchClearCalendars(this.$route.params.id);
    //   console.log(response);
    //   await this.loadCalendars();
    // },
    async deleteEvent(event) {
      const response = await fetchDeleteCalendar(
        this.$route.params.id,
        event.name,
        this.password,
      );
      console.log(response);
      if (!response.status) {
        this.$emit("openSnackbar", response.message);
      }
      await this.loadCalendars();
    },
  },
  data: () => ({
    uploadDialogue: false,
    name: "New User",
    password: "",
    rules: [(value) => (value && value.length != 0) || "Invalid name"],
    events: [],
  }),
};
</script>
