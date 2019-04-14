module.exports = {
  title: "Agola",
  themeConfig: {
    //displayAllHeaders: true,
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/doc/" },
      { text: "External", link: "https://google.com" }
    ],
    sidebar: {
      "/doc/architecture/": getArchitectureSidebar("Architecture"),
      "/doc/config/": getConfigSidebar("Config"),
      "/doc/": getDocSidebar("Doc")
    }
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

function getDocSidebar(group) {
  return [
    {
      title: group,
      collapsable: false,
      children: ["config/", "architecture/"]
    }
  ];
}

function getConfigSidebar(group) {
  return [
    {
      title: group,
      collapsable: false,
      children: ["", "reference", "caching"]
    }
  ];
}

function getArchitectureSidebar(group) {
  return [
    {
      title: group,
      collapsable: false,
      children: ["", "runservice"]
    }
  ];
}
