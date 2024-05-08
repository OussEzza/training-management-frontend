<template>
  <div class="container mt-4">
    <h2>Edit Training</h2>
    <div class="mb-3">
      <label for="inputTrainingName" class="form-label">Training Name:</label>
      <input
        type="text"
        class="form-control"
        id="inputTrainingName"
        v-model="name"
      />
      <div v-if="errors.name" class="text-danger">{{ errors.name[0] }}</div>
    </div>
    <div class="mb-3">
      <label for="inputDuration" class="form-label">Duration:</label>
      <input
        type="text"
        class="form-control"
        id="inputDuration"
        v-model="duration"
      />
      <div v-if="errors.duration" class="text-danger">
        {{ errors.duration[0] }}
      </div>
    </div>
    <div class="mb-3">
      <label for="inputCategory" class="form-label">Category:</label>
      <input
        type="text"
        class="form-control"
        id="inputCategory"
        v-model="category"
      />
      <div v-if="errors.category" class="text-danger">
        {{ errors.category[0] }}
      </div>
    </div>
    <button class="btn btn-primary" @click="updateTraining">
      Update Training
    </button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditTraining",
  data() {
    return {
      name: "",
      duration: "",
      category: "",
      errors: {},
    };
  },
  created() {
    this.fetchTraining();
  },
  methods: {
    async fetchTraining() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/trainings/${this.$route.params.id}`
        );
        const training = response.data.training;
        if (training) {
          this.name = training.name;
          this.duration = training.duration; // Convert to integer
          this.category = training.category; // Set category name
        }

        console.log("Training response  ", response.data);
      } catch (error) {
        console.error("Error fetching training:", error);
      }
    },
    async updateTraining() {
      try {
        console.log("Payload:", {
          name: this.name,
          duration: this.duration,
          category: this.category, // Include category in payload
        });

        // Send the update request to the server
        const response = await axios.put(
          `http://127.0.0.1:8000/api/trainings/${this.$route.params.id}`,
          {
            name: this.name,
            duration: this.duration,
            category: this.category, // Include category in request body
          }
        );
        console.log("Response:", response.data); // Log response data for debugging
        this.$router.push("/trainings");
      } catch (error) {
        console.error("Error updating training:", error.response);
      }
    },
  },
};
</script>
