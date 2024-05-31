<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Agent Training Assignments</h3>
      </div>
      <!-- Table to display agents with their training -->
      <div class="table-responsive">
        <table class="table table-striped table-hover mt-4">
          <thead class="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Agent</th>
              <th scope="col">Training</th>
              <th scope="col">Validity</th>
              <th scope="col">Category</th>
              <th scope="col">Start date</th>
              <th scope="col">End date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(record, index) in agent_training" :key="record.id">
              <td>{{ index + 1 + (currentPage - 1) * perPage }}</td>
              <td>{{ getAgentName(record.agent_id) }}</td>
              <td>{{ getTrainingName(record.training_id) }}</td>
              <td>{{ getTrainingDuration(record.training_id) }}</td>
              <td>{{ getTrainingCategory(record.training_id) }}</td>
              <td>{{ record.date_from }}</td>
              <td>{{ record.date_to }}</td>
              <td>
                <button
                  class="btn btn-primary btn-sm m-1"
                  @click="editRecord(record)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="confirmDelete(record.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
    </div>
    <!-- Edit Modal -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">Edit Record</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateRecord">
              <!-- Form fields for editing -->
              <div class="mb-3">
                <label for="training" class="form-label">Training</label>
                <select
                  v-model="editForm.training_id"
                  class="form-select"
                  id="training"
                  required
                >
                  <option
                    v-for="training in trainings"
                    :key="training.id"
                    :value="training.id"
                  >
                    {{ training.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="agent" class="form-label">Agent</label>
                <select
                  v-model="editForm.agent_id"
                  class="form-select"
                  id="agent"
                  required
                >
                  <option
                    v-for="agent in agents"
                    :key="agent.id"
                    :value="agent.id"
                  >
                    {{ agent.name }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="date_from" class="form-label">Start Date</label>
                <input
                  type="date"
                  v-model="editForm.date_from"
                  class="form-control"
                  id="date_from"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="date_to" class="form-label">End Date</label>
                <input
                  type="date"
                  v-model="editForm.date_to"
                  class="form-control"
                  id="date_to"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">
                Save changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      id="deleteModal"
      tabindex="-1"
      aria-labelledby="deleteModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this record?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="deleteRecord">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as bootstrap from "bootstrap";

import { useToast } from "vue-toastification";

export default {
  name: "ViewAssigned",
  data() {
    return {
      agent_training: [],
      agents: [],
      trainings: [],
      currentPage: 1,
      totalPages: 1,
      perPage: 10,
      editForm: {
        id: null,
        training_id: null,
        agent_id: null,
        date_from: null,
        date_to: null,
      },
      deleteId: null,
      toast: useToast(),
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
        const response = await axios.get(
          "http://127.0.0.1:8000/api/agent-training",
          {
            params: {
              agent_id: this.$route.params.id,
              page: this.currentPage,
              perPage: this.perPage,
            },
          }
        );
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
    editRecord(record) {
      this.editForm = { ...record };
      const editModal = new bootstrap.Modal(
        document.getElementById("editModal")
      );
      editModal.show();
    },
    async updateRecord() {
      try {
        await axios.put(
          `http://127.0.0.1:8000/api/agent-training/${this.editForm.id}`,
          this.editForm
        );
        this.toast.success("Record updated successfully");
        this.getAgentTraining();
        const editModal = bootstrap.Modal.getInstance(
          document.getElementById("editModal")
        );
        editModal.hide();
      } catch (error) {
        this.toast.error("Failed to update record");
        console.error(error);
      }
    },
    confirmDelete(id) {
      this.deleteId = id;
      const deleteModal = new bootstrap.Modal(
        document.getElementById("deleteModal")
      );
      deleteModal.show();
    },
    async deleteRecord() {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/agent-training/${this.deleteId}`
        );
        this.toast.success("Record deleted successfully");
        this.getAgentTraining();
        const deleteModal = bootstrap.Modal.getInstance(
          document.getElementById("deleteModal")
        );
        deleteModal.hide();
      } catch (error) {
        this.toast.error("Failed to delete record");
        console.error(error);
      }
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

<style>
/* Add any necessary styles here */
</style>
