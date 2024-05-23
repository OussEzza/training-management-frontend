<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div class="card shadow-sm" style="width: 100%; max-width: 500px;">
      <div class="card-body">
        <img
          src="../assets/logo.png"
          alt="Login Image"
          class="img-fluid rounded mx-auto d-block mb-4"
          style="max-height: 200px"
        />
        <h1 class="text-center mb-4">Login</h1>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              class="form-control"
              id="email"
              aria-describedby="emailHelp"
              v-model="loginData.email"
              :class="{ 'is-invalid': errors.email }"
              @input="clearError('email')"
              required
            />
            <div v-if="errors.email" class="invalid-feedback d-block">
              {{ errors.email }}
            </div>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="password"
              v-model="loginData.password"
              :class="{ 'is-invalid': errors.password }"
              @input="clearError('password')"
              required
            />
            <div v-if="errors.password" class="invalid-feedback d-block">
              {{ errors.password }}
            </div>
          </div>
          <div class="d-grid">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>
      </div>
    </div>
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

<style scoped>
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

.img-fluid {
  max-height: 200px;
}
</style>
