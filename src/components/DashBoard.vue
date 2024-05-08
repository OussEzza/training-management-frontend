<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Dashboard</h2>
    <div class="row">
      <div class="col-md-3">
        <router-link to="/agents" class="card-link">
          <div class="card primary">
            <div class="card-body">
              <h5 class="card-title">Total Agents</h5>
              <p class="card-text">{{ agentCount }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-3">
        <router-link to="/trainings" class="card-link">
          <div class="card success">
            <div class="card-body">
              <h5 class="card-title">Total Trainings</h5>
              <p class="card-text">{{ trainingCount }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DashBoard",
  data() {
    return {
      agentCount: 0,
      trainingCount: 0,
    };
  },
  created() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const agentResponse = await axios.get(
          "http://127.0.0.1:8000/api/agents"
        );
        this.agentCount = agentResponse.data.agents.length;

        const trainingResponse = await axios.get(
          "http://127.0.0.1:8000/api/trainings"
        );
        this.trainingCount = trainingResponse.data.trainings.length;

      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.card-link {
  text-decoration: none;
}

.card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.card-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.primary {
  background-color: #007bff;
  color: #fff;
}

.success {
  background-color: #28a745;
  color: #fff;
}

</style>
