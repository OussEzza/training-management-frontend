<template>
  <div class="container m-10">
    <img
      src="../assets/logo.png"
      alt="Login Image"
      class="img-fluid rounded mx-auto d-block mb-4"
      style="height: 200px"
    />
    <h1>Login</h1>
    <form @submit.prevent="login" class="mb-4">
      <div class="mb-3">
        <label for="exampleInputEmail1" class="form-label">Email address</label>
        <input
          type="email"
          class="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          v-model="loginData.email"
        />
        <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
      </div>
      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="loginData.password"
        />
        <div v-if="errors.password" class="text-danger">
          {{ errors.password }}
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      loginData: {
        email: "",
        password: "",
      },
      errors: {
        email: null,
        password: null,
      },
    };
  },
  methods: {
    async login() {
      // Reset errors
      this.errors = {
        email: null,
        password: null,
      };

      // Perform validation
      if (!this.loginData.email) {
        this.errors.email = "Email is required";
      }
      if (!this.loginData.password) {
        this.errors.password = "Password is required";
      }

      // If there are errors, stop login process
      if (this.errors.email || this.errors.password) {
        return;
      }

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.loginData.email,
          password: this.loginData.password,
        });
        const { user, token } = response.data;
        localStorage.setItem("token", token);
        // Optionally, you can also store user data in local storage if needed
        localStorage.setItem("user", JSON.stringify(user));
        this.$router.push("/");
      } catch (error) {
        console.error("Login error:", error.response.data);
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
