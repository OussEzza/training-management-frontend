<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link class="navbar-brand text-light" to="/">Navbar</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/' }"
              aria-current="page"
              to="/"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/trainings' }"
              to="/trainings"
            >
              Training
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/agents' }"
              to="/agents"
            >
              Agent
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              class="nav-link text-light"
              :class="{ active: $route.path === '/agent-training' }"
              to="/agent-training"
            >
              Assign Agent
            </router-link>
          </li>
          <li class="nav-item">
            <!-- Notification button -->
            <div class="dropdown">
              <button
                type="button"
                class="btn btn-warning ms-2 dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-bell"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M8 16a1.5 1.5 0 0 0 1.5-1.5h-3A1.5 1.5 0 0 0 8 16zm7-9V7c0 3.066-2.214 5.629-5.068 6.143a.75.75 0 0 0 .136.248l.522.522H5.41l.522-.522a.75.75 0 0 0 .136-.248C2.214 12.629 0 10.066 0 7V7l1-.001A7 7 0 0 1 8 .999zm-7-2a1 1 0 0 0-1 1v1c0 2.325 1.791 4.243 4.097 4.472.251.854.957 1.528 1.903 1.528s1.652-.674 1.903-1.528C14.209 5.243 16 3.325 16 1V0h-1v1c0 1.518-1.109 2.782-2.561 2.97a3.25 3.25 0 0 1-6.878 0C2.109 3.782 1 2.518 1 1V0H0v1a1 1 0 0 0 1 1z"
                  />
                </svg>
                <span class="badge bg-danger">{{
                  expiringTrainings.length
                }}</span>
              </button>
              <ul class="dropdown-menu">
                <li>
                  <div class="dropdown-item-text">
                    <label for="days"
                      >Show trainings expiring in less than:</label
                    >
                    <input
                      type="number"
                      id="days"
                      v-model="expiringInDays"
                      @change="showExpiringTrainingsAlert"
                      min="1"
                    />
                    <span> days</span>
                    <div class="dropdown-item-text">
                      <input
                        type="checkbox"
                        id="showAllTrainings"
                        v-model="showAllTrainings"
                        @change="showExpiringTrainingsAlert"
                      />
                      <label for="showAllTrainings"
                        >Show also expired trainings</label
                      >
                    </div>
                  </div>
                </li>
                <li v-if="expiringTrainings.length > 0">
                  <h6 class="dropdown-header">Expiring Trainings</h6>
                  <button
                    v-for="(agentTraining, index) in expiringTrainings"
                    :key="index"
                    type="button"
                    class="dropdown-item bg-warning text-dark"
                    @click="redirectToTraining(agentTraining)"
                  >
                    <!-- Display agent name, training name, date, and status with Bootstrap styles -->
                    The agent
                    <span class="fw-bold text-primary">{{
                      getAgentName(agentTraining.agent_id)
                    }}</span>
                    is undergoing training
                    <span class="fw-bold text-success">{{
                      getTrainingName(agentTraining.training_id)
                    }}</span>
                    scheduled for
                    <span class="fst-italic text-muted">{{
                      agentTraining.date_to
                    }}</span
                    >. This training has
                    <span
                      v-if="agentTraining.expired === 1"
                      class="badge bg-danger"
                    >
                      expired.
                    </span>
                    <span v-else class="badge bg-success">
                      not expired yet.
                    </span>
                  </button>
                </li>

                <li v-else>
                  <span class="dropdown-item-text">No expiring trainings</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
        <button type="button" @click="logout" class="btn btn-danger">
          Logout
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      agent_training: [],
      expiringTrainings: [],
      agents: [],
      trainings: [],
      showAllTrainings: false,
      expiringInDays: 30, // Default value for testing
    };
  },
  methods: {
    async logout() {
      try {
        await axios.post("http://127.0.0.1:8000/api/logout", null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
        console.log("Logout completed");
      } catch (error) {
        console.error("Logout error:", error.response.data);
      }
    },
    async getAgentTraining() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/agent-training",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        this.agent_training = response.data.agent_training;
        this.showExpiringTrainingsAlert();
      } catch (error) {
        console.error("Error fetching agent training:", error);
      }
    },
    async getAgents() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/agents");
        this.agents = response.data.agents;
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    },
    async getTrainings() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/trainings");
        this.trainings = response.data.trainings;
      } catch (error) {
        console.error("Error fetching trainings:", error);
      }
    },
    async showExpiringTrainingsAlert() {
      // Get today's date
      const today = new Date();
      // Initialize the array to store expiring trainings
      this.expiringTrainings = [];

      // Loop through each training of the agent
      for (const training of this.agent_training) {
        try {
          // Fetch details of the training from the API
          const response = await axios.get(
            `http://127.0.0.1:8000/api/trainings/${training.training_id}`
          );

          // Get the start date of the training
          const startDate = new Date(training.date_to);

          // Get the duration and duration unit of the training
          const duration = response.data.training.duration;
          const durationUnit = response.data.training.duration_unit;

          // Convert duration to days
          let durationInDays = 0;
          if (durationUnit === "year") {
            durationInDays = duration * 365; // Assuming 1 year = 365 days
          } else if (durationUnit === "month") {
            // Approximate months to days (assuming 30 days per month)
            durationInDays = duration * 30;
          } else if (durationUnit === "day") {
            durationInDays = duration;
          }
          console.log("durationInDays ", durationInDays);
          // Calculate the expiry date based on the start date and duration
          const expiryDate = new Date(
            startDate.getTime() + durationInDays * 24 * 60 * 60 * 1000
          );
          console.log("Expir date: " + expiryDate);
          // Calculate the difference in days between expiry date and today's date
          const diffInDays = Math.floor(
            (expiryDate - today) / (1000 * 60 * 60 * 24)
          );
          console.log("diffInDays is ", diffInDays);
          // Check if the training is expiring within the specified period
          if (this.showAllTrainings) {
            if (diffInDays <= this.expiringInDays)
              this.expiringTrainings.push(training);
          } else if (diffInDays <= this.expiringInDays && diffInDays > 0) {
            // If yes, push the training to the expiringTrainings array
            this.expiringTrainings.push(training);
          }
        } catch (error) {
          // Handle any errors that occur during the process
          console.error("Error fetching training details:", error);
        }
      }
    },
    async updateExpiredStatus() {
      // Assuming you're calling this function in response to a user action
      axios
        .post("http://127.0.0.1:8000/api/update-expired-status")
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error updating expired status:", error);
        });
    },
    getAgentName(agentId) {
      const agent = this.agents.find((agent) => agent.id === agentId);
      return agent ? agent.name : "";
    },
    getTrainingName(trainingId) {
      const training = this.trainings.find(
        (training) => training.id === trainingId
      );
      return training ? training.name : "";
    },
    redirectToTraining(training) {
      console.log("Redirect to training:", training);
      // Implement the logic to navigate to the training details page
    },
  },
  created() {
    this.getAgentTraining();
    this.getAgents();
    this.getTrainings();
    this.updateExpiredStatus();
  },
};
</script>
