<template>
  <div id="app">
    <v-app
      ><v-app-bar color="primary" elevation="4" app dark>
        <v-toolbar-title>
          ZotCalendar
          <v-icon>mdi-calendar-multiple</v-icon>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="secondary" @click="redirectHome">Home</v-btn>
      </v-app-bar>
      <v-main><router-view @openSnackbar="openSnackbar"/></v-main>
      <v-snackbar v-model="snackbar">
        {{ text }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  methods: {
    async redirectHome() {
      if (this.$route.name == "Home") {
        return;
      }
      this.$router.push("/");
    },
    openSnackbar(text) {
      this.snackbar = true;
      this.text = text;
    }
  },
  data: () => ({
    snackbar: false,
    text: "",
  }),
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
