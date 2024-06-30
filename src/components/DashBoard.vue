<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Dashboard</h2>
    <div class="row">
      <div class="col-md-4">
        <router-link to="/agents" class="card-link">
          <div class="card primary">
            <div class="card-body">
              <h5 class="card-title">Total Agents</h5>
              <p class="card-text">{{ agentCount }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/trainings" class="card-link">
          <div class="card success">
            <div class="card-body">
              <h5 class="card-title">Total Trainings</h5>
              <p class="card-text">{{ trainingCount }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/agent-training" class="card-link">
          <div class="card info">
            <div class="card-body">
              <h5 class="card-title">Total Agent in Training</h5>
              <p class="card-text">{{ agentTrainingCount }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-md-4">
        <router-link to="/agent-training" class="card-link">
          <div class="card info">
            <div class="card-body">
              <h5 class="card-title">Total agent without Training</h5>
              <p class="card-text">{{ agentWithoutTrainingCount }}</p>
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
      agentTrainingCount: 0,
      agentWithoutTrainingCount: 0,
    };
  },
  created() {
    this.fetchStatistics();
  },
  methods: {
    async fetchStatistics() {
      try {
        const agentResponse = await axios.get("http://127.0.0.1:8000/api/agents");
        const agents = agentResponse.data.agents;
        this.agentCount = agents.length;

        const trainingResponse = await axios.get("http://127.0.0.1:8000/api/trainings");
        this.trainingCount = trainingResponse.data.trainings.length;

        const agentTrainingResponse = await axios.get("http://127.0.0.1:8000/api/agent-training");
        const agentTrainings = agentTrainingResponse.data.agent_training;

        // Use a set to track unique agents who have training
        const agentsWithTraining = new Set();
        agentTrainings.forEach(at => agentsWithTraining.add(at.agent_id));
        
        // Set the count of unique agents in training
        this.agentTrainingCount = agentsWithTraining.size;

        // Calculate agents without training
        this.agentWithoutTrainingCount = this.agentCount - agentsWithTraining.size;
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

.info {
  background-color: #17a2b8;
  color: #fff;
}

.col-md-4 {
  margin-bottom: 20px;
}
</style>
