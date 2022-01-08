<template>
  <v-row>
    <v-col>
      <v-sheet>
        <v-calendar
          ref="calendar"
          :now="today"
          :value="today"
          :events="events"
          :event-color="getEventColor"
          :weekdays="weekdays"
          color="primary"
          type="week"
          @click:event="showEvent"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="deleteEvent">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    today: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    events: {
      type: Array,
      default: () => [],
    },
    weekdays: {
      type: Array,
      default: () => [1, 2, 3, 4, 5],
    },
  },
  mounted() {
    this.$refs.calendar.scrollToTime("08:00");
  },
  data: () => ({
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
  }),
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    deleteEvent() {
      this.selectedOpen = false;
      this.$emit("delete", this.selectedEvent);
    },
  },
};
</script>
