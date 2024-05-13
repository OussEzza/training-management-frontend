<template>
  <div class="container mt-4">
    <div class="card">
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
                <button type="button" class="close" @click="showModal = false">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label for="selectAgent" class="form-label">Agent:</label>
                  <select
                    class="form-select"
                    id="selectAgent"
                    v-model="agentId"
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
                  <div v-if="errors.agentId" class="text-danger">
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
                  <div v-if="errors.trainingId" class="text-danger">
                    {{ errors.trainingId[0] }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="date" class="form-label">Date:</label>
                  <input
                    type="date"
                    class="form-control"
                    id="date"
                    v-model="date"
                  />
                  <div v-if="errors.date" class="text-danger">
                    {{ errors.date[0] }}
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
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in agent_training" :key="record.id">
              <td>{{ getAgentName(record.agent_id) }}</td>
              <td>{{ getTrainingName(record.training_id) }}</td>
              <td>{{ record.date }}</td>
            </tr>
          </tbody>
        </table>
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
      date: "",
      errors: {},
      showModal: false,
      errorAssignAgentToTraining: "",
      messageAssignAgentToTraining: "",
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
        if (this.agentId && this.trainingId && this.date) {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/agent-training",
            {
              agent_id: this.agentId,
              training_id: this.trainingId,
              date: this.date,
            }
          );
          this.agentId = "";
          this.trainingId = "";
          this.date = "";
          console.log("Response:", response.data);
          this.showModal = false;
          this.getAgentTraining();
          this.messageAssignAgentToTraining =
            "Agent assigned to training successfully";
          this.errorAssignAgentToTraining = "";
        } else {
          this.messageAssignAgentToTraining = "";
          this.errorAssignAgentToTraining = "All fields are required";
        }
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
          this.errorAssignAgentToTraining =
            "Validation failed. Please check the input fields.";
        } else {
          console.error("Error assigning agent to training:", error);
          this.errorAssignAgentToTraining =
            "Error assigning agent to training. Please try again later.";
        }
      }
    },

    async getAgentTraining() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/agent-training"
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
  },
};
</script>
