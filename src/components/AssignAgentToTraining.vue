<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h3>Assign Agents to Trainings</h3>
      </div>
      <div class="card-body">
        <button class="btn btn-primary" @click="showModal = true">
          Add Agent to Training
        </button>

        <div
          v-if="showModal"
          class="modal"
          tabindex="-1"
          role="dialog"
          style="display: block"
        >
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Assign Agent to Training</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  @click="showModal = false"
                ></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="selectAgent" class="form-label">Agent:</label>
                  <select
                    class="form-select"
                    id="selectAgent"
                    v-model="agentId"
                    :class="{ 'is-invalid': errors.agentId }"
                  >
                    <option value="">Select Agent</option>
                    <option
                      v-for="agent in agents"
                      :key="agent.id"
                      :value="agent.id"
                    >
                      {{ agent.name }}
                    </option>
                  </select>
                  <div v-if="errors.agentId" class="invalid-feedback">
                    {{ errors.agentId[0] }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="selectTraining" class="form-label"
                    >Training:</label
                  >
                  <select
                    class="form-select"
                    id="selectTraining"
                    v-model="trainingId"
                    :class="{ 'is-invalid': errors.trainingId }"
                  >
                    <option value="">Select Training</option>
                    <option
                      v-for="training in trainings"
                      :key="training.id"
                      :value="training.id"
                    >
                      {{ training.name }}
                    </option>
                  </select>
                  <div v-if="errors.trainingId" class="invalid-feedback">
                    {{ errors.trainingId[0] }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="dateFrom" class="form-label">Date From:</label>
                  <input
                    type="date"
                    class="form-control"
                    id="dateFrom"
                    v-model="dateFrom"
                    :class="{ 'is-invalid': errors.dateFrom }"
                  />
                  <div v-if="errors.dateFrom" class="invalid-feedback">
                    {{ errors.dateFrom[0] }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="dateTo" class="form-label">Date To:</label>
                  <input
                    type="date"
                    class="form-control"
                    id="dateTo"
                    v-model="dateTo"
                    :class="{ 'is-invalid': errors.dateTo }"
                  />
                  <div v-if="errors.dateTo" class="invalid-feedback">
                    {{ errors.dateTo[0] }}
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="showModal = false"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="assignAgentToTraining"
                >
                  Assign
                </button>
              </div>
              <div
                v-if="messageAssignAgentToTraining"
                class="alert alert-success mt-3"
                role="alert"
              >
                {{ messageAssignAgentToTraining }}
              </div>

              <div
                v-if="errorAssignAgentToTraining"
                class="alert alert-danger mt-3"
                role="alert"
              >
                {{ errorAssignAgentToTraining }}
              </div>
            </div>
          </div>
        </div>

        <!-- Table to display agents with their training -->
        <table class="table table-striped table-bordered mt-4">
          <thead class="table-dark">
            <tr>
              <th>Agent</th>
              <th>Training</th>
              <th>Start date</th>
              <th>End date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in agent_training" :key="record.id">
              <td>{{ getAgentName(record.agent_id) }}</td>
              <td>{{ getTrainingName(record.training_id) }}</td>
              <td>{{ record.date_from }}</td>
              <td>{{ record.date_to }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-center mt-3">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(1)"
                >First</a
              >
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(currentPage - 1)"
                >Previous</a
              >
            </li>
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: currentPage === page }"
            >
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{
                page
              }}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(currentPage + 1)"
                >Next</a
              >
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage === totalPages }"
            >
              <a
                class="page-link"
                href="#"
                @click.prevent="changePage(totalPages)"
                >Last</a
              >
            </li>
          </ul>
        </nav>

        <!-- Toast component for success message -->
        <div
          class="toast align-items-center bg-success text-white border-0"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          :class="{ show: showToast }"
          style="
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
          "
        >
          <div class="d-flex">
            <div class="toast-body">
              Agent assigned to training successfully!
            </div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
              @click="closeToast"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "AssignAgentToTraining",
  data() {
    return {
      agent_training: [],
      agents: [],
      trainings: [],
      agentId: "",
      trainingId: "",
      dateFrom: "",
      dateTo: "",
      errors: {},
      showModal: false,
      showToast: false,
      errorAssignAgentToTraining: "",
      messageAssignAgentToTraining: "",
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
    async assignAgentToTraining() {
      try {
        if (this.validateForm()) {
          await axios.post("http://127.0.0.1:8000/api/agent-training", {
            agent_id: this.agentId,
            training_id: this.trainingId,
            date_from: this.dateFrom,
            date_to: this.dateTo,
          });
          // Reset data properties and close modal
          this.agentId = "";
          this.trainingId = "";
          this.dateFrom = "";
          this.dateTo = "";
          this.showModal = false;
          // Fetch updated data and show success message
          this.getAgentTraining();
          this.showToast = true;
          this.messageAssignAgentToTraining = "Agent assigned to training successfully";
          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        } else {
          this.messageAssignAgentToTraining = "";
          this.errorAssignAgentToTraining = "All fields are required";
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
          this.errorAssignAgentToTraining = "Validation failed. Please check the input fields.";
        } else {
          console.error("Error assigning agent to training:", error);
          this.errorAssignAgentToTraining = "Error assigning agent to training. Please try again later.";
        }
      }
    },
    async getAgentTraining() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/agent-training", {
          params: {
            page: this.currentPage,
            perPage: this.perPage,
            training_id: this.trainingId || undefined,
            agent_id: this.agentId || undefined,
          },
        });
        this.agent_training = response.data.agent_training;
        this.totalPages = response.data.total_pages;
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
    validateForm() {
      this.errors = {};

      if (!this.agentId) {
        this.errors.agentId = ["Agent is required"];
      }
      if (!this.trainingId) {
        this.errors.trainingId = ["Training is required"];
      }
      if (!this.dateFrom) {
        this.errors.dateFrom = ["Start date is required"];
      }
      if (!this.dateTo) {
        this.errors.dateTo = ["End date is required"];
      }

      return Object.keys(this.errors).length === 0;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.getAgentTraining();
      }
    },
    closeToast() {
      this.showToast = false;
    },
  },
  watch: {
    agentId(newAgentId) {
      if (!newAgentId) {
        this.errors.agentId = ["Agent is required"];
      } else {
        this.errors.agentId = "";
      }
    },
    trainingId(newTrainingId) {
      if (!newTrainingId) {
        this.errors.trainingId = ["Training is required"];
      } else {
        this.errors.trainingId = "";
      }
    },
    dateFrom(newDate) {
      if (!newDate) {
        this.errors.date = ["Date is required"];
      } else {
        this.errors.date = "";
      }
    },
    dateTo(newDate) {
      if (!newDate) {
        this.errors.date = ["Date is required"];
      } else {
        this.errors.date = "";
      }
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
.toast {
  width: 300px;
}
</style>
