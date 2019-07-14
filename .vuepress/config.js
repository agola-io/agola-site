const glob = require('glob')

const getChildren = function (rootdir, dir) {
  let childs = []
  let allChilds = glob.sync(rootdir + '/' + dir + '/*.md')

  allChilds.forEach(child => {
    // remove "rootdir" and ".md"
    child = child.slice(rootdir.length + 1, -3)
    // ignore README
    if (child.endsWith('README')) {
      return
    }
    childs.push(child)
  })

  childs.sort()

  return childs
}

module.exports = {
  title: "Agola",
  head: [
    ['link', { rel: 'icon', href: '/agola-logo.ico' }],
    ['meta', { name: 'go-import', content: 'agola.io/agola git https://github.com/agola-io/agola' }],
  ],
  themeConfig: {
    //displayAllHeaders: true,
    logo: "/agola-logo-name.svg",
    nav: [
      { text: "Try it", link: "/tryit/" },
      { text: "Documentation", link: "/doc/" },
      {
        text: 'Learn More',
        items: [
          {
            text: 'About',
            items: [
              {
                text: 'Features',
                link: '/about/features/'
              },
            ]
          },
        ]
      },
    ],
    sidebar: {
      "/tryit/": [
        ""
      ],
      "/doc/": [
        "",
        {
          title: "Installation",
          collapsable: false,
          children: [
            "installation/config",
            "installation/standalone",
            "installation/kubernetes",
          ],
        },
        {
          title: "Concepts",
          collapsable: false,
          children: [
            "concepts/users_orgs",
            "concepts/projects",
            "concepts/runs",
            "concepts/workspaces",
            "concepts/secrets_variables",
            "concepts/user_direct_runs"
          ],
        },
        {
          title: "Run Configuration",
          path: "/doc/config/",
          collapsable: false,
          children: [
            "config/reference",
            "config/caching",
            "config/docker_registries_auth",
            {
              title: "Examples",
              collapsable: false,
              children: getChildren("doc", "config/examples")
            },
            "config/FAQ"
          ]
        },
        {
          title: "Architecture",
          path: "/doc/architecture/",
          collapsable: false,
          children: [
            "architecture/runservice"
          ]
        },
      ],
    },
  },
  plugins: [
    ["@vuepress/back-to-top", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true
      }
    ],
    ["@vuepress/medium-zoom", true],
    ["@vuepress/notification", true]
  ]
};
