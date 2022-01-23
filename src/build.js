const Vue = require("vue");
const fs = require("fs");
const App = require("./main.vue");
const store = require("./store.js");
const path = require("path");
const { createBundleRenderer } = require("vue-server-renderer");

const app = new Vue({
  template: `<div>Hello World</div>`,
  render: h => h(App)
});
const distDir = path.join(__dirname, "../dist");
const templatesDir = path.join(__dirname, "../templates");
const paths = {
  templatesDir,
  indexTemplate: path.join(templatesDir, "ssr-index.html"),
  ssrServerBundleJson: path.join(distDir, "ssrServerBundle.json")
};

const context = {
  title: "Campaigner"
};

const renderer = createBundleRenderer(ssrServerBundleJson, {
  template: fs.readFileSync(paths.indexTemplate, { encoding: "utf-8" })
});

renderer
  .renderToString(app, context)
  .then(html => {
    fs.writeFileSync("./dist/main.html", html, { encoding: "utf-8" });
  })
  .catch(err => {
    console.error(err);
  });
