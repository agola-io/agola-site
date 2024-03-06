import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import MyLayout from "./MyLayout.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: MyLayout,
} satisfies Theme;
