<template>
  <div class="container mt-5">
    <h2>User Registration</h2>
    <form @submit.prevent="registerUser" class="mb-3">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Email:</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          class="form-control"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password:</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
    <p v-if="success" class="text-success">{{ success }}</p>
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
      error: "",
      success: "",
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/register", this.formData);
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
/* Add your custom styles here */
</style>
