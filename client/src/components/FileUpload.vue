
<template>
  <v-dialog @click:outside="closeDialog" :value="isOpen" max-width="450px">
    <v-card
      @drop.prevent="onDrop($event)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
      :class="{ 'grey lighten-2': dragover }"
    >
      <v-card-text>
        <v-row class="d-flex flex-column" dense align="center" justify="center">
          <v-icon :class="[dragover ? 'mt-2, mb-6' : 'mt-5']" size="60">
            mdi-cloud-upload
          </v-icon>
          <p>Upload or drop your .ics file here.</p>
        </v-row>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <input id="fileUpload" type="file" @change="onFileUploaded" hidden />
        <v-btn text @click="uploadFile"> Upload </v-btn>
        <v-btn text @click="closeDialog"> Cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Upload",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    dragover: false,
    uploadedFiles: [],
  }),
  methods: {
    uploadFile() {
      const fileUploadElement = document.getElementById("fileUpload");
      fileUploadElement.click();
    },
    onFileUploaded(e) {
      this.emitFile(e.target.files[0]);
    },
    closeDialog() {
      const fileUploadElement = document.getElementById("fileUpload");
      fileUploadElement.value = "";
      this.$emit("close");
    },
    onDrop(e) {
      this.dragover = false;
      Array.from(e.dataTransfer.files).forEach((file) => {
        if (file.name.endsWith(".ics")) {
          this.emitFile(file);
        }
      });
    },
    emitFile(file) {
      this.$emit("file-uploaded", file);
      this.closeDialog();
    },
  },
};
</script>