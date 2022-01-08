<template>
  <div class="home">
    <v-container>
      <v-row>
        <v-col align-self="center"
          ><v-btn color="primary" elevation="2" @click="createNewGroup"
            >Create New Group</v-btn
          ></v-col
        >
      </v-row>
      <v-row>
        <v-col align-self="center"
          ><v-text-field
            id="group-code"
            label="Group Code"
            :rules="rules"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col align-self="center">
          <v-btn color="primary" elevation="2" @click="joinGroup"
            >Join Group</v-btn
          ></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { fetchCreateNewGroup } from "../api/groups";

export default {
  name: "Home",
  methods: {
    async createNewGroup() {
      if (!this.isLoading) {
        this.isLoading = true;
        const newGroup = await fetchCreateNewGroup();
        this.isLoading = false;
        this.$router.push(`/groups/${newGroup.id}`);
      }
    },
    joinGroup() {
      const groupCode = document
        .getElementById("group-code")
        .value.toUpperCase();
      if (groupCode) {
        this.$router.push(`/groups/${groupCode}`);
      }
    },
  },
  data: () => ({
    isLoading: false,
    rules: [(value) => (value && value.length == 6) || "Invalid group code"],
  }),
};
</script>
