<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">Manage Agents</div>
      <div class="card-body">
        <!-- Filter Section -->
        <div class="mb-3">
          <label for="searchAgentName" class="form-label"
            >Search Agent by Name:</label
          >
          <input
            type="text"
            class="form-control"
            id="searchAgentName"
            v-model="searchName"
            placeholder="Enter agent name..."
          />
        </div>

        <div class="mb-3">
          <label for="searchAgentService" class="form-label"
            >Search Agent by Service:</label
          >
          <input
            type="text"
            class="form-control"
            id="searchAgentService"
            v-model="searchService"
            placeholder="Enter agent service..."
          />
        </div>

        <div class="mb-3">
          <label for="searchAgentFunction" class="form-label"
            >Search Agent by Function:</label
          >
          <input
            type="text"
            class="form-control"
            id="searchAgentFunction"
            v-model="searchFunction"
            placeholder="Enter agent function..."
          />
        </div>

        <!-- Table Section -->
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Service</th>
              <th>Function</th>
              <th>Actions</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(agent, index) in filteredAgentsList" :key="agent.id">
              <td>{{ index + 1 }}</td>
              <td>{{ agent.name }}</td>
              <td>{{ agent.service }}</td>
              <td>{{ agent.function }}</td>
              <td>
                <!-- Router link for editing agent -->
                <!-- <router-link
                  :to="{ name: 'EditAgent', params: { id: agent.id } }"
                  class="btn btn-sm btn-primary me-1"
                >
                  Edit
                </router-link> -->
                <button
                  class="btn btn-sm btn-danger"
                  @click="deleteAgent(agent.id)"
                >
                  Delete
                </button>
              </td>
              <td>
                <router-link
                  :to="{ name: 'ViewAssignedTraining', params: { id: agent.id } }"
                  class="btn btn-sm btn-primary me-1"
                >
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Add New Agent Form -->
        <div class="text-end mt-3">
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addAgentModal"
          >
            Add New Agent
          </button>
        </div>
        <div
          class="modal fade"
          id="addAgentModal"
          tabindex="-1"
          aria-labelledby="addAgentModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addAgentModalLabel">
                  Add New Agent
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="inputName" class="form-label">Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="inputName"
                    v-model="name"
                    placeholder="Enter name"
                  />
                </div>
                <div class="mb-3">
                  <label for="inputService" class="form-label">Service:</label>
                  <input
                    type="text"
                    class="form-control"
                    id="inputService"
                    v-model="service"
                    placeholder="Enter service"
                  />
                </div>
                <div class="mb-3">
                  <label for="inputFunction" class="form-label"
                    >Function:</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="inputFunction"
                    v-model="func"
                    placeholder="Enter function"
                  />
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" class="btn btn-primary" @click="addAgent">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AgentView",
  data() {
    return {
      agents: [],
      name: "",
      service: "",
      func: "",
      searchName: "",
      searchService: "",
      searchFunction: "",
    };
  },
  computed: {
    filteredAgentsList() {
      return this.agents.filter((agent) => {
        const isMatchingName = agent.name
          .toLowerCase()
          .includes(this.searchName.toLowerCase());
        const isMatchingService = agent.service
          .toLowerCase()
          .includes(this.searchService.toLowerCase());
        const isMatchingFunction = agent.function
          .toLowerCase()
          .includes(this.searchFunction.toLowerCase());
        return isMatchingName && isMatchingService && isMatchingFunction;
      });
    },
  },
  created() {
    this.getAgents();
  },
  methods: {
    async getAgents() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/agents");
        this.agents = response.data.agents;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteAgent(id) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/agents/${id}`);
        this.getAgents();
      } catch (error) {
        console.log(error);
      }
    },
    async addAgent() {
      try {
        await axios.post("http://127.0.0.1:8000/api/agents", {
          name: this.name,
          service: this.service,
          function: this.func,
          department: this.dept,
        });
        this.name = "";
        this.service = "";
        this.func = "";
        this.dept = "";
        this.getAgents();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
