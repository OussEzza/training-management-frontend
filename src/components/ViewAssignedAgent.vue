<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h3>Agent Training Assignments</h3>
      </div>
      <!-- Table to display agents with their training -->
      <table class="table table-striped table-hover mt-4">
        <thead class="table-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Training</th>
            <th scope="col">Agent</th>
            <th scope="col">Email</th>
            <th scope="col">Service</th>
            <th scope="col">Function</th>
            <th scope="col">Start date</th>
            <th scope="col">End date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in agent_training" :key="record.id">
            <td>{{ index + 1 }}</td>
            <td>{{ getTrainingName(record.training_id) }}</td>
            <td>{{ getAgentName(record.agent_id) }}</td>
            <td>{{ getAgentEmail(record.agent_id) }}</td>
            <td>{{ getAgentService(record.agent_id) }}</td>
            <td>{{ getAgentFunction(record.agent_id) }}</td>
            <td>{{ record.date_from }}</td>
            <td>{{ record.date_to }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mt-3">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(1)">First</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
          </li>
          <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(totalPages)">Last</a>
          </li>
        </ul>
      </nav>
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
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
    };
  },
  created() {
    this.getAgentTraining();
    this.getAgents();
    this.getTrainings();
  },
  methods: {
    async getAgentTraining() {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/agent-training`, {
          params: {
            training_id: this.$route.params.id,
            page: this.currentPage,
            perPage: this.perPage,
          },
        });
        this.agent_training = response.data.agent_training;
        this.totalPages = response.data.total_pages;
        this.currentPage = response.data.current_page;
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
    getAgentEmail(agentId) {
      const agent = this.agents.find((agent) => agent.id === agentId);
      return agent ? agent.email : "";
    },
    getAgentService(agentId) {
      const agent = this.agents.find((agent) => agent.id === agentId);
      return agent ? agent.service : "";
    },
    getAgentFunction(agentId) {
      const agent = this.agents.find((agent) => agent.id === agentId);
      return agent ? agent.function : "";
    },
    getTrainingName(trainingId) {
      const training = this.trainings.find((training) => training.id === trainingId);
      return training ? training.name : "";
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAgentTraining();
      }
    },
  },
};
</script>
