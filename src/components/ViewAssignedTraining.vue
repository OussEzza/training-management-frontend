<template>
  <div class="container mt-4">
    <div class="card">
      <!-- Table to display agents with their training -->
      <table class="table table-striped table-hover mt-4">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Agent</th>
            <th scope="col">Training</th>
            <th scope="col">Service</th>
            <th scope="col">Function</th>
            <th scope="col">Start date</th>
              <th scope="col">End date</th>
                      </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in agent_training" :key="record.id">
            <td>{{ index + 1 }}</td>
            <td>{{ getAgentName(record.agent_id) }}</td>
            <td>{{ getTrainingName(record.training_id) }}</td>
            <td>{{ getTrainingDuration(record.training_id) }}</td>
            <td>{{ getTrainingCategory(record.training_id) }}</td>
            <td>{{ record.date_from }}</td>
            <td>{{ record.date_to }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ViewAssigned",
  data() {
    return {
      agent_training: [],
      agents: [],
      trainings: [],
      errors: {},
      index: 0,
    };
  },
  created() {
    this.getAgentTraining(this.$route.params.id);
    this.getAgents();
    this.getTrainings();
  },
  methods: {
    async getAgentTraining(agentId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/agent-training?agent_id=${agentId}`
        );
        this.agent_training = response.data.agent_training;
      } catch (error) {
        console.error(error);
      }
    },
    async getAgents() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/agents");
        this.agents = response.data.agents;
      } catch (error) {
        console.error(error);
      }
    },
    async getTrainings() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/trainings");
        this.trainings = response.data.trainings;
      } catch (error) {
        console.error(error);
      }
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
    getTrainingDuration(trainingId) {
      const training = this.trainings.find(
        (training) => training.id === trainingId
      );
      return training ? training.duration : "";
    },
    getTrainingCategory(trainingId) {
      const training = this.trainings.find(
        (training) => training.id === trainingId
      );
      return training ? training.category : "";
    },
  },
};
</script>
