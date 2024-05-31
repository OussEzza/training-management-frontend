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
                  <button
                    class="btn btn-sm btn-primary me-1"
                    @click="showEditAgentModal(agent)"
                  >
                    Edit
                  </button>
                  <button
                    class="btn btn-sm btn-danger"
                    @click="showDeleteConfirmationModal(agent.id)"
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
          <!-- Error Alerts -->
          <div
            v-if="errorGetAgents"
            class="alert alert-danger mt-3"
            role="alert"
          >
            {{ errorGetAgents }}
          </div>
        </div>

        <!-- Add New Agent Button -->
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
                      Add Agent
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

        <!-- Edit Agent Modal -->
        <div
          class="modal fade"
          id="editAgentModal"
          tabindex="-1"
          aria-labelledby="editAgentModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="editAgentModalLabel">Edit Agent</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="handleEditAgent">
                  <div class="mb-3">
                    <label for="editInputName" class="form-label">Name:</label>
                    <input
                      type="text"
                      class="form-control"
                      id="editInputName"
                      v-model="editName"
                      placeholder="Enter name"
                      :class="{ 'is-invalid': editNameError }"
                    />
                    <div v-if="editNameError" class="invalid-feedback">
                      {{ editNameError }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="editInputEmail" class="form-label"
                      >Email:</label
                    >
                    <input
                      type="email"
                      class="form-control"
                      id="editInputEmail"
                      v-model="editEmail"
                      placeholder="Enter email"
                      :class="{ 'is-invalid': editEmailError }"
                    />
                    <div v-if="editEmailError" class="invalid-feedback">
                      {{ editEmailError }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="editInputService" class="form-label"
                      >Service:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="editInputService"
                      v-model="editService"
                      placeholder="Enter service"
                      :class="{ 'is-invalid': editServiceError }"
                    />
                    <div v-if="editServiceError" class="invalid-feedback">
                      {{ editServiceError }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="editInputFunction" class="form-label"
                      >Function:</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="editInputFunction"
                      v-model="editFunc"
                      placeholder="Enter function"
                      :class="{ 'is-invalid': editFuncError }"
                    />
                    <div v-if="editFuncError" class="invalid-feedback">
                      {{ editFuncError }}
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
                  v-if="errorEditAgent"
                  class="alert alert-danger mt-3"
                  role="alert"
                >
                  {{ errorEditAgent }}
                </div>
              </div>
            </div>
          </div>
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
                  Confirm Delete
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
                <button
                  type="button"
                  class="btn btn-danger"
                  @click="deleteAgent"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Toast Notification -->

        <div
          class="toast-container align-items-center text-white border-0"
          style="
            position: fixed;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
          "
          :class="{ show: showSuccessToast }"
        >
          <div
            id="liveToast"
            class="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-bs-delay="3000"
          >
            <div class="toast-header">
              <strong class="me-auto">Notification</strong>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                @click="closeToast"
              ></button>
            </div>
            <div class="toast-body bg-success">{{ toastMessage }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as bootstrap from "bootstrap";

export default {
  data() {
    return {
      agents: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchName: "",
      searchService: "",
      searchFunction: "",
      name: "",
      email: "",
      service: "",
      func: "",
      nameError: "",
      emailError: "",
      serviceError: "",
      funcError: "",
      editName: "",
      editEmail: "",
      editService: "",
      editFunc: "",
      editNameError: "",
      editEmailError: "",
      editServiceError: "",
      editFuncError: "",
      editAgentId: null,
      errorAddAgent: "",
      errorEditAgent: "",
      deleteAgentId: null,
      toastMessage: "",
      showSuccessToast: false,
      errorGetAgents: "",
    };
  },
  computed: {
    filteredAgents() {
      if (!this.agents) return [];
      return this.agents.filter(
        (agent) =>
          (!this.searchName ||
            agent.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
          (!this.searchService ||
            agent.service
              .toLowerCase()
              .includes(this.searchService.toLowerCase())) &&
          (!this.searchFunction ||
            agent.function
              .toLowerCase()
              .includes(this.searchFunction.toLowerCase()))
      );
    },
    totalPages() {
      return Math.ceil(this.filteredAgents.length / this.itemsPerPage);
    },
    currentPageItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredAgents.slice(start, end);
    },
    isEmailValid() {
      return (
        this.email &&
        this.isValidEmail(this.email) &&
        !this.emailExists(this.email)
      );
    },
  },
  methods: {
    fetchAgents() {
  axios.get("http://127.0.0.1:8000/api/agents")
    .then((response) => {
      this.agents = response.data.agents;
    })
    .catch((error) => {
      this.errorGetAgents = "Failed to retrieve agents.";
      console.error("Error fetching agents:", error); // Log the error for debugging
    });
},

    changePage(page) {
      this.currentPage = page;
    },
    validateEmail() {
      const errors = {};
      if (!this.email) {
        errors.email = "Email is required.";
      } else if (!this.isValidEmail(this.email)) {
        errors.email = "Invalid email format";
      } else if (this.emailExists(this.email)) {
        errors.email = "Email already exists";
      }
      this.emailError = errors.email || ""; // Set emailError directly
      return errors; // Return the errors object
    },
    validateEditEmail() {
      if (!this.editEmail) {
        this.editEmailError = "Email is required.";
      } else if (!this.isValidEmail(this.editEmail)) {
        this.editEmailError = "Invalid email format.";
      } else {
        this.editEmailError = "";
      }
    },
    handleAddAgent() {
      // Validate input fields
      this.validateName(this.name);
      this.validateService(this.service);
      this.validateFunction(this.func);
      const emailErrors = this.validateEmail(); // Call the validation method

      if (
        this.nameError ||
        this.serviceError ||
        this.funcError ||
        Object.keys(emailErrors).length > 0
      ) {
        return;
      }

      // Reset error messages
      this.errorAddAgent = "";

      axios
        .post("http://127.0.0.1:8000/api/agents", {
          name: this.name,
          email: this.email,
          service: this.service,
          function: this.func,
        })
        .then(() => {
          this.fetchAgents();
          this.showToast("Agent added successfully!");
          this.resetAddAgentForm();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.errorAddAgent = error.response.data.message;
          } else {
            this.errorAddAgent = "An error occurred while adding the agent.";
          }
        });
    },

    handleEditAgent() {
      // Validate input fields
      this.validateName(this.editName);
      this.validateService(this.editService);
      this.validateFunction(this.editFunc);
      this.validateEditEmail();

      if (
        this.editNameError ||
        this.editServiceError ||
        this.editFuncError ||
        this.editEmailError
      ) {
        return;
      }

      // Reset error messages
      this.errorEditAgent = "";

      axios
        .put(`http://127.0.0.1:8000/api/agents/${this.editAgentId}`, {
          name: this.editName,
          email: this.editEmail,
          service: this.editService,
          function: this.editFunc,
        })
        .then(() => {
          this.showToast("Agent updated successfully!");
          this.resetEditAgentForm();
          this.fetchAgents();
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            this.errorEditAgent = error.response.data.message;
          } else {
            this.errorEditAgent = "An error occurred while updating the agent.";
          }
        });
    },
    showEditAgentModal(agent) {
      this.editName = agent.name;
      this.editEmail = agent.email;
      this.editService = agent.service;
      this.editFunc = agent.function;
      this.editAgentId = agent.id;

      const editAgentModal = new bootstrap.Modal(
        document.getElementById("editAgentModal")
      );
      editAgentModal.show();
    },
    showDeleteConfirmationModal(agentId) {
      this.deleteAgentId = agentId;
      const deleteConfirmationModal = new bootstrap.Modal(
        document.getElementById("deleteConfirmationModal")
      );
      deleteConfirmationModal.show();
    },
    deleteAgent() {
      axios
        .delete(`http://127.0.0.1:8000/api/agents/${this.deleteAgentId}`)
        .then(() => {
          this.agents = this.agents.filter(
            (agent) => agent.id !== this.deleteAgentId
          );
          this.showToast("Agent deleted successfully!");
          this.deleteAgentId = null;
          const deleteConfirmationModal = bootstrap.Modal.getInstance(
            document.getElementById("deleteConfirmationModal")
          );
          deleteConfirmationModal.hide();
        })
        .catch((error) => {
          console.error("Error deleting agent:", error);
        });
    },
    resetAddAgentForm() {
      this.name = "";
      this.email = "";
      this.service = "";
      this.func = "";
      this.nameError = "";
      this.emailError = "";
      this.serviceError = "";
      this.funcError = "";
      this.errorAddAgent = "";
      const addAgentModal = bootstrap.Modal.getInstance(
        document.getElementById("addAgentModal")
      );
      addAgentModal.hide();
    },
    resetEditAgentForm() {
      this.editName = "";
      this.editEmail = "";
      this.editService = "";
      this.editFunc = "";
      this.editAgentId = null;
      this.errorEditAgent = "";
      const editAgentModal = bootstrap.Modal.getInstance(
        document.getElementById("editAgentModal")
      );
      editAgentModal.hide();
    },
    showToast(message) {
      this.toastMessage = message;
      const toast = new bootstrap.Toast(document.getElementById("liveToast"));
      toast.show();
    },
    closeToast() {
      this.showSuccessToast = false;
    },
    emailExists(email) {
      return this.agents.some((agent) => agent.email === email);
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    validateName(name) {
      if (!name) {
        this.nameError = "Name is required.";
      } else {
        this.nameError = "";
      }
    },
    validateService(service) {
      if (!service) {
        this.serviceError = "Service is required.";
      } else {
        this.serviceError = "";
      }
    },
    validateFunction(func) {
      if (!func) {
        this.funcError = "Function is required.";
      } else {
        this.funcError = "";
      }
    },
  },
  mounted() {
    this.fetchAgents();
  },
  watch: {
    // "name"(newName) {
    //   this.validateName(newName);
    // },
    // "service"(newService) {
    //   this.validateService(newService);
    // },
    // "func"(newFunc) {
    //   this.validateFunction(newFunc);
    // },
    email() {
      this.validateEmail(); // Call the validation method
    },
    editEmail() {
      this.validateEditEmail();
    },
  },
};
</script>

<style>
.modal-footer .btn + .btn {
  margin-left: 0.5rem;
}
</style>
