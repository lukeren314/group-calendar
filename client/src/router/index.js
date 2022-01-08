import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Group from "../views/Group.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/groups/:id",
    name: "Group",
    component: Group,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
