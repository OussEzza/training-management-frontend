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
          <label for="exampleInputEmail1" class="form-label"
            >Email address</label
          >
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            v-model="loginData.email"
            required
          />
          <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            v-model="loginData.password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary">Login</button>
    </form>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="mb-3">
        <label for="name" class="form-label">Name:</label>
        <input
          type="text"
          v-model="registerData.name"
          class="form-control"
          id="name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="emailReg" class="form-label">Email:</label>
        <input
          type="email"
          v-model="registerData.email"
          class="form-control"
          id="emailReg"
          required
        />
      </div>
      <div class="mb-3">
        <label for="passwordReg" class="form-label">Password:</label>
        <input
          type="password"
          v-model="registerData.password"
          class="form-control"
          id="passwordReg"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
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
      registerData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.loginData.email,
          password: this.loginData.password,
        });
        console.log(response.data);
        // Store the token in local storage or cookies
        this.$router.push("/");
      } catch (error) {
        console.error("Login error:", error.response.data);
      }
    },

    async register() {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/register",
          this.registerData
        );
        console.log(response.data);
        // Optionally, you can automatically login the user after registration
        // this.loginData.email = this.registerData.email;
        // this.loginData.password = this.registerData.password;
        // this.login();
      } catch (error) {
        console.error("Registration error:", error.response.data.errors);
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
