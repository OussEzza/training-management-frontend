<template>
  <div class="container mt-4">
    <div class="card">
      <div class="card-header">Manage Trainings</div>
      <div class="card-body">
        <div class="mb-3">
          <label for="searchTrainingName" class="form-label"
            >Search Training by Name:</label
          >
          <input
            type="text"
            class="form-control"
            id="searchTrainingName"
            v-model="searchName"
            placeholder="Enter training name..."
          />
        </div>
        <div class="mb-3">
          <label for="searchTrainingDuration" class="form-label"
            >Search Training by Duration:</label
          >
          <input
            type="text"
            class="form-control"
            id="searchTrainingDuration"
            v-model="searchDuration"
            placeholder="Enter training duration..."
          />
        </div>
        <div class="mb-3">
          <label for="selectCategory" class="form-label"
            >Filter by Category:</label
          >
          <select
            class="form-select"
            id="selectCategory"
            v-model="selectedCategory"
          >
            <option value="">All Categories</option>
            <option
              v-for="category in uniqueCategories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Training Name</th>
          <th>Duration per year</th>
          <th>Category</th>
          <th>Actions</th>
          <th>View</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(training, index) in currentPageItems" :key="training.id">
          <td>{{ index + 1 }}</td>
          <td>{{ training.name }}</td>
          <td>{{ training.duration }}</td>
          <td>{{ training.category }}</td>
          <td>
            <router-link
              :to="{ name: 'Edit', params: { id: training.id } }"
              class="btn btn-sm btn-primary me-1"
              >Edit</router-link
            >
            <button
              class="btn btn-sm btn-danger"
              @click="confirmDeleteTraining(training.id)"
            >
              Delete
            </button>
          </td>
          <td>
            <router-link
              :to="{ name: 'ViewAssignedAgent', params: { id: training.id } }"
              class="btn btn-sm btn-primary me-1"
              >View</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-end mt-3">
      <button
        type="button"
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addTrainingModal"
      >
        Add New Training
      </button>
    </div>

    <div
      class="modal fade"
      id="addTrainingModal"
      tabindex="-1"
      aria-labelledby="addTrainingModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addTrainingModalLabel">
              Add New Training
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
              <label for="inputTrainingName" class="form-label"
                >Training Name:</label
              >
              <input
                type="text"
                class="form-control"
                id="inputTrainingName"
                name="name"
                v-model="training.name"
                placeholder="Enter training name..."
                :class="{ 'is-invalid': trainingNameError }"
                required
              />
              <div v-if="trainingNameError" class="invalid-feedback">
                {{ trainingNameError }}
              </div>
            </div>
            <div class="mb-3">
              <label for="inputDuration" class="form-label"
                >Duration per year:</label
              >
              <input
                type="text"
                class="form-control"
                id="inputDuration"
                name="duration"
                v-model="training.duration"
                placeholder="Enter duration..."
                :class="{ 'is-invalid': trainingDurationError }"
                required
              />
              <div v-if="trainingDurationError" class="invalid-feedback">
                {{ trainingDurationError }}
              </div>
            </div>
            <div class="mb-3">
              <label for="inputCategory" class="form-label">Category:</label>
              <select
                class="form-select"
                id="inputCategory"
                v-model="training.category"
                :class="{ 'is-invalid': trainingCategoryError }"
              >
                <option value="">Select Category</option>
                <option
                  v-for="category in Categories"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <div v-if="trainingCategoryError" class="invalid-feedback">
                {{ trainingCategoryError }}
              </div>
            </div>
            <button type="button" class="btn btn-primary" @click="saveTraining">
              Add Training
            </button>
          </div>
          <div
            v-if="errorAddTraining"
            class="alert alert-danger mt-3"
            role="alert"
          >
            {{ errorAddTraining }}
          </div>
        </div>
      </div>
    </div>

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
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>

    <div v-if="errorGetTrainings" class="alert alert-danger mt-3" role="alert">
      {{ errorGetTrainings }}
    </div>
    <div
      v-if="errorDeleteTraining"
      class="alert alert-danger mt-3"
      role="alert"
    >
      {{ errorDeleteTraining }}
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
    class="modal"
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
          Are you sure you want to delete this training?
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
  name: "TrainingView",
  data() {
    return {
      trainings: [],
      searchName: "",
      selectedCategory: "",
      searchDuration: "",
      training: {
        name: "",
        duration: "",
        category: "",
      },
      Categories: ["Category 1", "Category 2", "Category 3"],
      currentPage: 1,
      pageSize: 2,
      errorGetTrainings: "",
      errorDeleteTraining: "",
      errorAddTraining: "",
      trainingNameError: "",
      trainingDurationError: "",
      trainingCategoryError: "",
      showToast: false,
      toastMessage: "",
      trainingIdToDelete: null,
    };
  },
  computed: {
    uniqueCategories() {
      return [...new Set(this.trainings.map((training) => training.category))];
    },
    filteredTrainingsList() {
      return this.trainings.filter((training) => {
        const isMatchingName = training.name
          .toLowerCase()
          .includes(this.searchName.toLowerCase());
        const isMatchingDuration = training.duration
          .toLowerCase()
          .includes(this.searchDuration.toLowerCase());
        const isSelectedCategory =
          this.selectedCategory === "" ||
          training.category.toLowerCase() ===
            this.selectedCategory.toLowerCase();
        return isMatchingName && isSelectedCategory && isMatchingDuration;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredTrainingsList.length / this.pageSize);
    },
    startIndex() {
      return (this.currentPage - 1) * this.pageSize;
    },
    endIndex() {
      return Math.min(
        this.startIndex + this.pageSize - 1,
        this.filteredTrainingsList.length - 1
      );
    },
    currentPageItems() {
      return this.filteredTrainingsList.slice(
        this.startIndex,
        this.endIndex + 1
      );
    },
  },
  created() {
    this.getTrainings();
  },
  methods: {
    async getTrainings() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/trainings");
        if (response.data && response.data.trainings) {
          this.trainings = response.data.trainings;
          this.errorGetTrainings = "";
        } else {
          this.errorGetTrainings = "No data available";
        }
      } catch (error) {
        this.errorGetTrainings = "Failed to fetch trainings";
        console.log(error);
      }
    },
    confirmDeleteTraining(id) {
      this.trainingIdToDelete = id;
      new bootstrap.Modal(
        document.getElementById("deleteConfirmationModal")
      ).show();
    },
    async confirmDelete() {
      if (this.trainingIdToDelete !== null) {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/trainings/${this.trainingIdToDelete}`
          );
          this.trainingIdToDelete = null;
          this.errorDeleteTraining = "";
          this.getTrainings();
          this.showSuccessToast("Training deleted successfully!");

          // Hide the confirmation modal using vanilla JavaScript
          const modal = document.getElementById("deleteConfirmationModal");
          modal.classList.remove("show");
          modal.setAttribute("aria-hidden", "true");
          modal.setAttribute("style", "display: none");
          document.body.classList.remove("modal-open");
          const modalBackdrop =
            document.getElementsByClassName("modal-backdrop");
          document.body.removeChild(modalBackdrop[0]);
        } catch (error) {
          this.errorDeleteTraining = "Failed to delete training";
          console.log(error);
        }
      }
    },

    async saveTraining() {
      try {
        if (this.validateForm()) {
          await axios.post("http://127.0.0.1:8000/api/trainings", {
            name: this.training.name,
            duration: this.training.duration,
            category: this.training.category,
          });
          this.training.name = "";
          this.training.duration = "";
          this.training.category = "";
          this.errorAddTraining = "";
          this.getTrainings();
          this.showSuccessToast("Training added successfully!");
        }
      } catch (error) {
        this.errorAddTraining = error.response
          ? error.response.data.message
          : "Failed to add training";
        console.log(error);
      }
    },
    validateForm() {
      this.trainingNameError = "";
      this.trainingDurationError = "";
      this.trainingCategoryError = "";

      if (!this.training.name) {
        this.trainingNameError = "Training name is required";
      }

      if (!this.training.duration) {
        this.trainingDurationError = "Duration is required";
      }

      if (!this.training.category) {
        this.trainingCategoryError = "Category is required";
      }

      return (
        !this.trainingNameError &&
        !this.trainingDurationError &&
        !this.trainingCategoryError
      );
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
    "training.name"(newName) {
      if (!newName) {
        this.trainingNameError = "Training name is required";
      } else {
        this.trainingNameError = "";
      }
    },
    "training.duration"(newDuration) {
      if (!newDuration) {
        this.trainingDurationError = "Duration is required";
      } else {
        this.trainingDurationError = "";
      }
    },
    "training.category"(newCategory) {
      if (!newCategory) {
        this.trainingCategoryError = "Category is required";
      } else {
        this.trainingCategoryError = "";
      }
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
}
.toast.show {
  display: block;
}
</style>
