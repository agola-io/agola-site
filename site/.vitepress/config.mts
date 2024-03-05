import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Agola",
  description: "Agola. CI/CD redefined.",
  appearance: false,
  head: [
    ["link", { rel: "icon", href: "/agola-logo.ico" }],
    [
      "meta",
      {
        name: "go-import",
        content: "agola.io/agola git https://github.com/agola-io/agola",
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/agola-logo-name.svg",
    siteTitle: false,
    search: {
      provider: "local",
    },
    nav: [
      { text: "Try it", link: "/tryit/" },
      { text: "Documentation", link: "/doc/" },
      {
        text: "Learn More",
        items: [
          {
            items: [
              {
                text: "Features",
                link: "/about/features/",
              },
            ],
          },
        ],
      },
    ],

    sidebar: {
      "/doc/": [
        {
          text: "Documentation",
          link: "/doc/",
        },
        {
          text: "Installation",
          collapsed: false,
          items: [
            {
              text: "Configuration",
              link: "/doc/installation/config",
            },
            {
              text: "Standalone",
              link: "/doc/installation/standalone",
            },
            {
              text: "Kubernetes",
              link: "/doc/installation/kubernetes",
            },
          ],
        },
        {
          text: "Concepts",
          collapsed: false,
          items: [
            {
              text: "Users / Organizations",
              link: "/doc/concepts/users_orgs",
            },
            {
              text: "Projects and Project Groups",
              link: "/doc/concepts/projects",
            },
            {
              text: "Run/Tasks/Steps",
              link: "/doc/concepts/runs",
            },
            {
              text: "Runs Workspaces",
              link: "/doc/concepts/workspaces",
            },
            {
              text: "Secrets and Variables",
              link: "/doc/concepts/secrets_variables",
            },
            {
              text: "User direct runs",
              link: "/doc/concepts/user_direct_runs",
            },
          ],
        },
        {
          text: "Run Configuration",
          collapsed: false,
          items: [
            {
              text: "Run Configuration Reference",
              link: "/doc/config/reference",
            },
            {
              text: "Caching",
              link: "/doc/config/caching",
            },
            {
              text: "Docker registries authentication",
              link: "/doc/config/docker_registries_auth",
            },
            {
              text: "Examples",
              collapsed: false,
              items: [
                {
                  text: "Building and pushing docker/oci images",
                  link: "/doc/config/examples/build_docker_oci_images",
                },
                {
                  text: "Go runs examples",
                  link: "/doc/config/examples/go",
                },
                {
                  text: "Vue.js runs examples",
                  link: "/doc/config/examples/vuejs",
                },
              ],
            },
            {
              text: "FAQ",
              link: "/doc/config/FAQ",
            },
          ],
        },
        {
          text: "Architecture",
          link: "/doc/architecture/",
          collapsed: false,
          items: [
            {
              text: "Run Service",
              link: "/doc/architecture/runservice",
            },
          ],
        },
      ],
    },
  },
});
