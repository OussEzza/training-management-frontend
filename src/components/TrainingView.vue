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
              v-for="category in Categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Training Name</th>
            <th>Validity</th>
            <th>Category</th>
            <th>Actions</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(training, index) in currentPageItems" :key="training.id">
            <td>{{ index + 1 }}</td>
            <td>{{ training.name }}</td>
            <td>{{ training.duration }} {{ training.duration_unit }}</td>
            <td>{{ training.category }}</td>
            <td>
              <!-- <router-link
                :to="{ name: 'Edit', params: { id: training.id } }"
                class="btn btn-sm btn-primary me-1"
                >Edit</router-link
              > -->
              <button
                class="btn btn-sm btn-primary me-1"
                @click="showEditTrainingModal(training)"
              >
                Edit
              </button>

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
    </div>
    <div class="text-end mt-3">
      <button
        type="button"
        class="btn btn-primary"
        @click="showAddTrainingModal"
      >
        Add New Training
      </button>
    </div>

    <!-- Add Training Modal -->
    <div
      v-if="showModal"
      class="modal fade show"
      id="addTrainingModal"
      tabindex="-1"
      aria-labelledby="addTrainingModalLabel"
      aria-modal="true"
      role="dialog"
      style="display: block"
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
              aria-label="Close"
              @click="hideAddTrainingModal"
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
              <label for="inputDuration" class="form-label">Validity:</label>
              <input
                type="number"
                class="form-control"
                id="inputDuration"
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
              <label for="inputDurationFormat" class="form-label"
                >Validity Format:</label
              >
              <select
                class="form-select"
                id="inputDurationFormat"
                v-model="training.durationFormat"
              >
                <option value="year">Year(s)</option>
                <option value="month">Month(s)</option>
                <option value="day">Day(s)</option>
              </select>
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
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideAddTrainingModal"
            >
              Close
            </button>
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

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="modal fade show"
      id="deleteConfirmationModal"
      tabindex="-1"
      aria-labelledby="deleteConfirmationModalLabel"
      aria-modal="true"
      role="dialog"
      style="display: block"
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
              aria-label="Close"
              @click="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this training?
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showDeleteModal = false"
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
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>

    <!-- Error Alerts -->
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

    <!-- Edit Training Modal -->
    <div
      v-if="showEditModal"
      class="modal fade show"
      id="editTrainingModal"
      tabindex="-1"
      aria-labelledby="editTrainingModalLabel"
      aria-modal="true"
      role="dialog"
      style="display: block"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editTrainingModalLabel">
              Edit Training
            </h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="hideEditTrainingModal"
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
                v-model="editingTraining.name"
                :class="{ 'is-invalid': trainingNameError }"
                required
              />
              <div v-if="trainingNameError" class="invalid-feedback">
                {{ trainingNameError }}
              </div>
            </div>
            <div class="mb-3">
              <label for="inputDuration" class="form-label">Validity:</label>
              <input
                type="number"
                class="form-control"
                id="inputDuration"
                v-model="editingTraining.duration"
                :class="{ 'is-invalid': trainingDurationError }"
                required
              />
              <div v-if="trainingDurationError" class="invalid-feedback">
                {{ trainingDurationError }}
              </div>
              <div class="mb-3">
                <label for="inputDurationFormat" class="form-label"
                  >Validity Format:</label
                >
                <select
                  class="form-select"
                  id="inputDurationFormat"
                  v-model="editingTraining.durationFormat"
                >
                  <option value="">Select Validity Format</option>
                  <option
                    v-for="durationFormat in durationFormats"
                    :key="durationFormat"
                    :value="durationFormat"
                  >
                    {{ durationFormat }}
                  </option>
                </select>
              </div>
              <!-- Validation error message if needed -->
              <div class="mb-3">
                <label for="inputCategory" class="form-label">Category:</label>
                <select
                  class="form-select"
                  id="inputCategory"
                  v-model="editingTraining.category"
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
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="hideEditTrainingModal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="saveEditedTraining"
              >
                Save Changes
              </button>
            </div>
          </div>
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
  </div>
</template>

<script>
import axios from "axios";

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
        durationFormat: "year",
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
      showModal: false,
      showDeleteModal: false,
      editingTraining: {
        id: null,
        name: "",
        duration: "",
        durationFormat: "",
        category: "",
      },
      durationFormats: ["year", "month", "day"],
      showEditModal: false,
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
        const isMatchingDuration =
          this.searchDuration === "" ||
          training.duration.toString().includes(this.searchDuration);
        const isMatchingCategory = this.selectedCategory
          ? training.category === this.selectedCategory
          : true;
        return isMatchingName && isMatchingDuration && isMatchingCategory;
      });
    },
    currentPageItems() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTrainingsList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTrainingsList.length / this.pageSize);
    },
  },
  methods: {
    async getTrainings() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/trainings");
        this.trainings = response.data.trainings;
        this.errorGetTrainings = "";
      } catch (error) {
        this.errorGetTrainings = "Failed to retrieve trainings.";
        console.error(error);
      }
    },
    confirmDeleteTraining(id) {
      this.trainingIdToDelete = id;
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      if (this.trainingIdToDelete !== null) {
        try {
          await axios.delete(
            `http://127.0.0.1:8000/api/trainings/${this.trainingIdToDelete}`
          );
          this.getTrainings();
          this.showSuccessToast("Training deleted successfully!");
          this.showDeleteModal = false;
        } catch (error) {
          this.errorDeleteTraining = "Failed to delete training";
          console.error(error);
        }
      }
    },
    validateForm(training) {
      const errors = {};
      if (!training.name) errors.trainingName = "Training name is required";
      if (!training.duration)
        errors.trainingDuration = "Training duration is required";
      if (!training.category)
        errors.trainingCategory = "Training category is required";
      return errors;
    },
    saveTraining() {
      const errors = this.validateForm(this.training);
      if (Object.keys(errors).length === 0) {
        axios
          .post("http://127.0.0.1:8000/api/trainings", {
            name: this.training.name,
            duration: this.training.duration,
            duration_unit: this.training.durationFormat,
            category: this.training.category,
          })
          .then(() => {
            this.getTrainings();
            this.showSuccessToast("Training added successfully!");
            this.hideAddTrainingModal();
          })
          .catch((error) => {
            this.errorAddTraining = error.response
              ? error.response.data.message
              : "Failed to add training";
            console.error(error);
          });
      } else {
        this.trainingNameError = errors.trainingName || "";
        this.trainingDurationError = errors.trainingDuration || "";
        this.trainingCategoryError = errors.trainingCategory || "";
      }
    },
    resetTrainingForm() {
      this.training = {
        name: "",
        duration: "",
        durationFormat: "year",
        category: "",
      };
      this.errorAddTraining = "";
      this.trainingNameError = "";
      this.trainingDurationError = "";
      this.trainingCategoryError = "";
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
    showAddTrainingModal() {
      this.showModal = true;
      this.resetTrainingForm();
    },
    hideAddTrainingModal() {
      this.showModal = false;
      this.resetTrainingForm();
    },
    showEditTrainingModal(training) {
      // this.editingTraining = { ...training };
      this.editingTraining = {
        id: training.id,
        name: training.name,
        duration: training.duration,
        durationFormat: training.duration_unit,
        category: training.category,
      }
      this.showEditModal = true;
    },
    hideEditTrainingModal() {
      this.showEditModal = false;
      this.editingTraining = {
        id: null,
        name: "",
        duration: "",
        durationFormat: "",
        category: "",
      };
    },
    validateEditForm() {
      return this.validateForm(this.editingTraining);
    },
    saveEditedTraining() {
      const errors = this.validateEditForm();
      if (Object.keys(errors).length === 0) {
        axios
          .put(
            `http://127.0.0.1:8000/api/trainings/${this.editingTraining.id}`,
            {
              // this.editingTraining
              name: this.editingTraining.name,
              duration: this.editingTraining.duration,
              duration_unit: this.editingTraining.durationFormat,
              category: this.editingTraining.category,
            }
          )
          .then(() => {
            this.getTrainings();
            this.showSuccessToast("Training updated successfully!");
            this.hideEditTrainingModal();
          })
          .catch((error) => {
            this.errorAddTraining = error.response
              ? error.response.data.message
              : "Failed to update training";
            console.error(error);
          });
      } else {
        this.trainingNameError = errors.trainingName || "";
        this.trainingDurationError = errors.trainingDuration || "";
        this.trainingCategoryError = errors.trainingCategory || "";
      }
    },
  },
  mounted() {
    this.getTrainings();
  },
  watch: {
    "training.name"(newName) {
      this.trainingNameError = !newName ? "Training name is required" : "";
    },
    "training.duration"(newDuration) {
      this.trainingDurationError = !newDuration ? "Validity is required" : "";
    },
    "training.category"(newCategory) {
      this.trainingCategoryError = !newCategory ? "Category is required" : "";
    },
    "editingTraining.name"(newName) {
      this.trainingNameError = !newName ? "Training name is required" : "";
    },
    "editingTraining.duration"(newDuration) {
      this.trainingDurationError = !newDuration ? "Validity is required" : "";
    },
    "editingTraining.category"(newCategory) {
      this.trainingCategoryError = !newCategory ? "Category is required" : "";
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  display: none;
}
</style>
