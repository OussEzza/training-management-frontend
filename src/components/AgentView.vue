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
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Function</th>
                <th>Actions</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(agent, index) in currentPageItems" :key="agent.id">
                <td>{{ index + 1 }}</td>
                <td>{{ agent.name }}</td>
                <td>{{ agent.email }}</td>
                <td>{{ agent.service }}</td>
                <td>{{ agent.function }}</td>
                <td>
                  <router-link
                    :to="{ name: 'EditAgent', params: { id: agent.id } }"
                    class="btn btn-sm btn-primary me-1"
                  >
                    Edit
                  </router-link>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="confirmDeleteAgent(agent.id)"
                  >
                    Delete
                  </button>
                </td>
                <td>
                  <router-link
                    :to="{
                      name: 'ViewAssignedTraining',
                      params: { id: agent.id },
                    }"
                    class="btn btn-sm btn-primary me-1"
                  >
                    View
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

        <!-- Add Agent Modal -->
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
                <form @submit.prevent="handleAddAgent">
                  <div class="mb-3">
                    <label for="inputName" class="form-label">Name:</label>
                    <input
                      type="text"
                      class="form-control"
                      id="inputName"
                      v-model="name"
                      placeholder="Enter name"
                      :class="{ 'is-invalid': nameError }"
                    />
                    <div v-if="nameError" class="invalid-feedback">
                      {{ nameError }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="inputEmail" class="form-label">Email:</label>
                    <input
                      type="email"
                      class="form-control"
                      id="inputEmail"
                      v-model="email"
                      placeholder="Enter email"
                      :class="{ 'is-invalid': emailError }"
                    />
                    <div v-if="emailError" class="invalid-feedback">
                      {{ emailError }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="inputService" class="form-label"
                      >Service:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="inputService"
                      v-model="service"
                      placeholder="Enter service"
                      :class="{ 'is-invalid': serviceError }"
                    />
                    <div v-if="serviceError" class="invalid-feedback">
                      {{ serviceError }}
                    </div>
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
                      :class="{ 'is-invalid': funcError }"
                    />
                    <div v-if="funcError" class="invalid-feedback">
                      {{ funcError }}
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
                    <button type="submit" class="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </form>
                <div
                  v-if="errorAddAgent"
                  class="alert alert-danger mt-3"
                  role="alert"
                >
                  {{ errorAddAgent }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav aria-label="Page navigation example" class="m-3">
        <ul class="pagination justify-content-end">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">Previous</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: page === currentPage }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="nextPage">Next</button>
          </li>
        </ul>
      </nav>
      <div v-if="errorGetAgents" class="alert alert-danger mt-3" role="alert">
        {{ errorGetAgents }}
      </div>
      <div v-if="errorDeleteAgent" class="alert alert-danger mt-3" role="alert">
        {{ errorDeleteAgent }}
      </div>
    </div>
  </div>

  <!-- Success Toast -->
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
      <div class="toast-body">{{ toastMessage }}</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        aria-label="Close"
        @click="closeToast"
      ></button>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div
    class="modal fade"
    id="deleteConfirmationModal"
    tabindex="-1"
    aria-labelledby="deleteConfirmationModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteConfirmationModalLabel">
            Confirm Deletion
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this agent?
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as bootstrap from "bootstrap";

export default {
  name: "AgentView",
  data() {
    return {
      agents: [],
      name: "",
      email: "",
      service: "",
      func: "",
      searchName: "",
      searchService: "",
      searchFunction: "",
      nameError: "",
      emailError: "",
      serviceError: "",
      funcError: "",
      errorGetAgents: "",
      errorDeleteAgent: "",
      errorAddAgent: "",
      currentPage: 1,
      pageSize: 2,
      showToast: false,
      toastMessage: "",
      agentIdToDelete: null,
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
    totalPages() {
      return Math.ceil(this.filteredAgentsList.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return Math.min(
        this.startIndex + this.pageSize - 1,
        this.filteredAgentsList.length - 1
      );
    },
    currentPageItems() {
      return this.filteredAgentsList.slice(this.startIndex, this.endIndex + 1);
    },
  },
  created() {
    this.getAgents();
  },
  methods: {
    async getAgents() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/agents");
        if (response.data && response.data.agents) {
          this.agents = response.data.agents;
          this.errorGetAgents = "";
        } else {
          this.errorGetAgents = "No data available";
        }
      } catch (error) {
        this.errorGetAgents = "Failed to fetch agents";
        console.log(error);
      }
    },
    confirmDeleteAgent(id) {
      this.agentIdToDelete = id;
      new bootstrap.Modal(
        document.getElementById("deleteConfirmationModal")
      ).show();
    },
    async confirmDelete() {
      if (this.agentIdToDelete !== null) {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/agents/${this.agentIdToDelete}`
          );
          this.agentIdToDelete = null;
          this.errorDeleteAgent = "";
          this.getAgents();
          this.showSuccessToast("Agent deleted successfully!");
          this.hideDeleteConfirmationModal();
        } catch (error) {
          this.errorDeleteAgent = "Failed to delete agent";
          console.log(error);
        }
      }
    },
    hideDeleteConfirmationModal() {
      const modal = document.getElementById("deleteConfirmationModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    async handleAddAgent(event) {
      event.preventDefault();
      try {
        if (this.validateForm()) {
          await axios.post("http://127.0.0.1:8000/api/agents", {
            name: this.name,
            email: this.email,
            service: this.service,
            function: this.func,
          });

          this.name = "";
          this.email = "";
          this.service = "";
          this.func = "";
          this.errorAddAgent = "";

          this.getAgents();
          this.showSuccessToast("Agent added successfully!");
          // this.hideAddAgentModal();
        }
      } catch (error) {
        this.errorAddAgent = error.response
          ? error.response.data.message
          : "Failed to add agent";
        console.log(error);
      }
    },
    hideAddAgentModal() {
      const modal = document.getElementById("addAgentModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    },
    validateForm() {
      this.nameError = "";
      this.emailError = "";
      this.serviceError = "";
      this.funcError = "";

      if (!this.name) {
        this.nameError = "Name is required";
      }

      if (!this.email) {
        this.emailError = "Email is required";
      } else if (!this.isValidEmail(this.email)) {
        this.emailError = "Invalid email format";
      } else if (this.emailExists(this.email)) {
        this.emailError = "Email already exists in the list";
      }

      if (!this.service) {
        this.serviceError = "Service is required";
      }

      if (!this.func) {
        this.funcError = "Function is required";
      }

      return (
        !this.nameError &&
        !this.emailError &&
        !this.serviceError &&
        !this.funcError
      );
    },
    emailExists(email) {
      return this.agents.some((agent) => agent.email === email);
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    showSuccessToast(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    closeToast() {
      this.showToast = false;
    },
  },
  watch: {
    email(newEmail) {
      if (newEmail && !this.isValidEmail(newEmail)) {
        this.emailError = "Invalid email format";
      } else {
        this.emailError = "";
      }
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
</style>
