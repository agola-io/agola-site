<!-- <template>
  <Layout>
    <template #aside-outline-before>
      <ClientOnly>
        <cookie-law theme="blood-orange--rounded">
          <div slot="message">
            This website uses cookies to ensure you get the best experience on
            our website.
            <a
              aria-label="learn more about cookies"
              role="button"
              tabindex="0"
              class="cc-link"
              href="https://www.cookiesandyou.com"
              rel="noopener noreferrer nofollow"
              target="_blank"
              >Learn more</a
            >
          </div>
        </cookie-law>
      </ClientOnly>
    </template>
  </Layout>
</template>

<script>
import DefaultTheme from "vitepress/theme";
import CookieLaw from "vue-cookie-law";

const { Layout } = DefaultTheme;
</script> -->

<!--.vitepress/theme/MyLayout.vue-->
<script setup>
import DefaultTheme from "vitepress/theme";
import VueCookieAcceptDecline from "vue-cookie-accept-decline";
import "vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css";

const { Layout } = DefaultTheme;
</script>

<template>
  <Layout>
    <template #doc-after>
      <ClientOnly>
        <vue-cookie-accept-decline elementId="01">
          <template #message>
            This website uses cookies to ensure you get the best experience on
            our website.
            <a
              aria-label="learn more about cookies"
              role="button"
              tabindex="0"
              class="cc-link"
              href="https://www.cookiesandyou.com"
              rel="noopener noreferrer nofollow"
              target="_blank"
              >Learn more</a
            >
          </template>
        </vue-cookie-accept-decline>
      </ClientOnly>
    </template>
  </Layout>
</template>
