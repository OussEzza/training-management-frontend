<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div class="card shadow-sm" style="width: 100%; max-width: 500px">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">User Registration</h2>
        <form @submit.prevent="validateForm">
          <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              class="form-control"
              :class="{ 'is-invalid': errors.name }"
              required
            />
            <div v-if="errors.name" class="invalid-feedback">
              {{ errors.name }}
            </div>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              class="form-control"
              :class="{ 'is-invalid': errors.email }"
              required
            />
            <div v-if="errors.email" class="invalid-feedback">
              {{ errors.email }}
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password:</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              class="form-control"
              :class="{ 'is-invalid': errors.password }"
              required
            />
            <div v-if="errors.password" class="invalid-feedback">
              {{ errors.password }}
            </div>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Register</button>
          </div>
        </form>
        <p v-if="error" class="text-danger mt-3">{{ error }}</p>
        <p v-if="success" class="text-success mt-3">{{ success }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
      errors: {
        name: "",
        email: "",
        password: "",
      },
      error: "",
      success: "",
    };
  },
  methods: {
    async validateForm() {
      this.clearErrors();
      let valid = true;

      if (!this.formData.name) {
        this.errors.name = "Name is required.";
        valid = false;
      }

      if (!this.formData.email) {
        this.errors.email = "Email is required.";
        valid = false;
      } else if (!this.isValidEmail(this.formData.email)) {
        this.errors.email = "Invalid email format.";
        valid = false;
      } else {
        // Check if email exists in the database
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/api/check-email",
            { email: this.formData.email }
          );
          if (response.data.exists) {
            this.errors.email = "Email already exists.";
            valid = false;
          }
        } catch (error) {
          this.error = "An error occurred while checking the email.";
          valid = false;
        }
      }

      if (!this.formData.password) {
        this.errors.password = "Password is required.";
        valid = false;
      } else if (this.formData.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters.";
        valid = false;
      }

      if (valid) {
        this.registerUser();
      }
    },
    isValidEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.[^<>()[\]\\.,;:\s@"]{2,}))$/i;
      return re.test(email);
    },
    clearErrors() {
      this.errors = {
        name: "",
        email: "",
        password: "",
      };
    },
    async registerUser() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/register",
          this.formData
        );
        this.success = "User registered successfully!";
        this.error = "";
        console.log(response.data.user);
      } catch (error) {
        this.error =
          error.response.data.message ||
          "An error occurred during registration.";
        this.success = "";
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
.card {
  border-radius: 10px;
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.invalid-feedback {
  display: block;
}
</style>
