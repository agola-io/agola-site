<template>
  <div>
    <ParentLayout />
    <ClientOnly>
      <cookie-law theme="blood-orange--rounded">
        <div slot="message">
          This website uses cookies to ensure you get the best experience on our website.
          <a
            aria-label="learn more about cookies"
            role="button"
            tabindex="0"
            class="cc-link"
            href="https://www.cookiesandyou.com"
            rel="noopener noreferrer nofollow"
            target="_blank"
          >Learn more</a>
        </div>
      </cookie-law>
    </ClientOnly>
  </div>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";
import CookieLaw from "vue-cookie-law";

export default {
  components: { ParentLayout, CookieLaw }
};
</script>
