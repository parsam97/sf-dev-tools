export default {
  name: "Salesforce Developer Tools",
  description: "Developer tools for Salesforce developers to better understand data and metadata.",
  version: "0.0",
  version_name: "0.0.0",
  icons: {
    128: "icon128.png"
  },
  action: {
    default_title: "Open popup",
    default_popup: "popup.html"
  },
  minimum_chrome_version: "88",
  permissions: ["cookies"],
  host_permissions: [
    "https://*.salesforce.com/*",
    "https://*.salesforce-setup.com/*",
    "https://*.force.com/*",
    "https://*.cloudforce.com/*",
    "https://*.visualforce.com/*",
    "https://*.sfcrmapps.cn/*",
    "https://*.sfcrmproducts.cn/*",
    "https://*.salesforce.mil/*",
    "https://*.force.mil/*",
    "https://*.cloudforce.mil/*",
    "https://*.visualforce.mil/*",
    "https://*.crmforce.mil/*",
    "https://*.force.com.mcas.ms/*",
    "https://*.builder.salesforce-experience.com/*"
  ],
  content_scripts: [{
    matches: [
      "https://*.salesforce.com/*",
      "https://*.salesforce-setup.com/*",
      "https://*.visual.force.com/*",
      "https://*.vf.force.com/*",
      "https://*.lightning.force.com/*",
      "https://*.cloudforce.com/*",
      "https://*.visualforce.com/*",
      "https://*.sfcrmapps.cn/*",
      "https://*.sfcrmproducts.cn/*",
      "https://*.salesforce.mil/*",
      "https://*.visual.force.mil/*",
      "https://*.vf.force.mil/*",
      "https://*.lightning.force.mil/*",
      "https://*.cloudforce.mil/*",
      "https://*.visualforce.mil/*",
      "https://*.crmforce.mil/*",
      "https://*.lightning.force.com.mcas.ms/*",
      "https://*.builder.salesforce-experience.com/*"
    ],
    all_frames: true,
    js: [
      "initOrgContext.js"
    ]
  }],
  background: {
    service_worker: "background.js",
    type: "module"
  },
  web_accessible_resources: [
    {
      resources: ["popup.html"],
      matches: [
        "https://*.salesforce.com/*",
        "https://*.salesforce-setup.com/*",
        "https://*.visual.force.com/*",
        "https://*.vf.force.com/*",
        "https://*.lightning.force.com/*",
        "https://*.cloudforce.com/*",
        "https://*.visualforce.com/*",
        "https://*.sfcrmapps.cn/*",
        "https://*.sfcrmproducts.cn/*",
        "https://*.salesforce.mil/*",
        "https://*.visual.force.mil/*",
        "https://*.vf.force.mil/*",
        "https://*.lightning.force.mil/*",
        "https://*.cloudforce.mil/*",
        "https://*.visualforce.mil/*",
        "https://*.crmforce.mil/*",
        "https://*.lightning.force.com.mcas.ms/*",
        "https://*.force.com/*",
        "https://*.builder.salesforce-experience.com/*"
      ],
      extension_ids: []
    }
  ],
  incognito: "split",
  manifest_version: 3,
  commands: {}
}