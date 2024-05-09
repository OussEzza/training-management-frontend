<template>
  <div class="container mt-4">
    <h2>Edit Agent</h2>
    <div class="mb-3">
      <label for="inputName" class="form-label">Name:</label>
      <input type="text" class="form-control" id="inputName" v-model="name" />
    </div>
    <div class="mb-3">
      <label for="inputService" class="form-label">Service:</label>
      <input type="text" class="form-control" id="inputService" v-model="service" />
    </div>
    <div class="mb-3">
      <label for="inputFunction" class="form-label">Function:</label>
      <input type="text" class="form-control" id="inputFunction" v-model="func" />
    </div>
    <!-- <div class="mb-3">
      <label for="inputDepartment" class="form-label">Department:</label>
      <input type="text" class="form-control" id="inputDepartment" v-model="dept" />
    </div> -->
    <button class="btn btn-primary" @click="updateAgent">Update Agent</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditAgent",
  data() {
    return {
      name: "",
      service: "",
      func: "",
      // dept: "",
      errors: {},
    };
  },
  created() {
    this.fetchAgent();
  },
  methods: {
    async fetchAgent() {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/agents/${this.$route.params.id}`
        );
        const agent = response.data.agent;
        if (agent) {
          this.name = agent.name;
          this.service = agent.service;
          this.func = agent.function;
          // this.dept = agent.department;
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
      }
    },
    async updateAgent() {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/agents/${this.$route.params.id}`,
          {
            name: this.name,
            service: this.service,
            function: this.func,
            // department: this.dept,
          }
        );
        console.log("Response:", response.data); // Log response data for debugging
        this.$router.push("/agents");
      } catch (error) {
        console.error("Error updating agent:", error.response);
        if (error.response && error.response.data && error.response.data.errors) {
          this.errors = error.response.data.errors;
        }
      }
    },
  },
};
</script>
  