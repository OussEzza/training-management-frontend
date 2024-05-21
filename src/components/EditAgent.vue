<template>
  <div class="container mt-4">
    <h2>Edit Agent</h2>
    <div class="mb-3">
      <label for="inputName" class="form-label">Name:</label>
      <input type="text" class="form-control" id="inputName" v-model="name" />
    </div>
    <div class="mb-3">
      <label for="inputEmail" class="form-label">Email:</label>
      <input type="email" class="form-control" id="inputEmail" v-model="email" />
    </div>
    <div class="mb-3">
      <label for="inputService" class="form-label">Service:</label>
      <input type="text" class="form-control" id="inputService" v-model="service" />
    </div>
    <div class="mb-3">
      <label for="inputFunction" class="form-label">Function:</label>
      <input type="text" class="form-control" id="inputFunction" v-model="func" />
    </div>
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
      email: "",
      service: "",
      func: "",
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
          this.email = agent.email;
          this.service = agent.service;
          this.func = agent.function;
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
            email: this.email,
            service: this.service,
            function: this.func,
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
  