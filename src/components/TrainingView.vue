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
          <th>Duration</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(training, index) in filteredTrainingsList"
          :key="training.id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ training.name }}</td>
          <td>{{ training.duration }}</td>
          <td>{{ training.category }}</td>
          <td>
            <router-link
              :to="{ name: 'Edit', params: { id: training.id } }"
              class="btn btn-sm btn-primary me-1"
            >
              Edit
            </router-link>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteTraining(training.id)"
            >
              Delete
            </button>
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
                required
              />
            </div>
            <div class="mb-3">
              <label for="inputDuration" class="form-label">Duration:</label>
              <input
                type="text"
                class="form-control"
                id="inputDuration"
                name="duration"
                v-model="training.duration"
                placeholder="Enter duration..."
                required
              />
            </div>
            <div class="mb-3">
              <label for="inputCategory" class="form-label">Category:</label>
              <input
                type="text"
                class="form-control"
                id="inputCategory"
                name="category"
                v-model="training.category"
                placeholder="Enter category..."
                required
              />
            </div>
            <button type="button" class="btn btn-primary" @click="saveTraining">
              Add Training
            </button>
          </div>
        </div>
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
        category: "",
      },
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
  },

  created() {
    this.getTrainings();
  },
  methods: {
    async getTrainings() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/trainings");
        this.trainings = response.data.trainings;
      } catch (error) {
        console.log(error);
      }
    },

    async deleteTraining(id) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/trainings/${id}`);
        this.getTrainings();
      } catch (error) {
        console.log(error);
      }
    },
    async saveTraining() {
      try {
        await axios.post("http://127.0.0.1:8000/api/trainings", {
          name: this.training.name,
          duration: this.training.duration,
          category: this.training.category,
        });
        this.training.name = "";
        this.training.duration = "";
        this.training.category = "";
        this.$router.push("/trainings");
        this.getTrainings();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
