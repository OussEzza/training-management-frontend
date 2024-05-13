<template>
  <div class="container m-10">
    <img
      src="../assets/logo.png"
      alt="Login Image"
      class="img-fluid rounded mx-auto d-block mb-4 mt-5"
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
          @input="clearError('email')"
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
          @input="clearError('password')"
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
      this.clearErrors();

      if (!this.loginData.email) {
        this.errors.email = "Email is required";
      }
      if (!this.loginData.password) {
        this.errors.password = "Password is required";
      }

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
        localStorage.setItem("user", JSON.stringify(user));
        this.$router.push("/");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.errors
        ) {
          if (error.response.data.errors.email) {
            this.errors.email = error.response.data.errors.email;
          }
          if (error.response.data.errors.password) {
            this.errors.password = error.response.data.errors.password;
          }
        } else {
          console.error("Login error:", error.response.data);
          alert("An error occurred during login. Please try again.");
        }
      }
    },
    clearError(field) {
      if (Object.prototype.hasOwnProperty.call(this.errors, field)) {
        this.errors[field] = null;
      }
    },
    clearErrors() {
      Object.keys(this.errors).forEach((key) => {
        this.errors[key] = null;
      });
    },
  },
};
</script>