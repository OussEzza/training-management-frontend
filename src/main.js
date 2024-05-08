import { createApp } from "vue";
import App from "./App.vue";
import Index from "./components/TrainingView.vue";
import Edit from "./components/EditTraining.vue";
import Login from "./components/AuthView.vue";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    name: "Login",
    path: "/login",
    component: Login,
  },
  {
    name: "Index",
    path: "/trainings",
    component: Index,
  },
  {
    name: "Edit",
    path: "/trainings/edit/:id",
    component: Edit,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");