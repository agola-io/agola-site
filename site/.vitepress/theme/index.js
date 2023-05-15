import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./custom.css";

export default {
  ...DefaultTheme,
  Layout: MyLayout,
};
