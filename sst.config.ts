/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "vedic-astro",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    // Deploy the static website
    const site = new sst.aws.StaticSite("VedicAstroSite", {
      path: ".",
      build: {
        command: "echo 'No build needed for static site'",
        output: ".",
      },
      indexPage: "index.html",
      errorPage: "index.html",
      // Optional: Add custom domain
      // domain: "astro.yourdomain.com",
    });

    return {
      site: site.url,
    };
  },
});
