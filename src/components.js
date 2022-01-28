import Vue from 'vue'
Vue.component('campaign-title', {
  props: ['name'],
  template: `
<h1>{{name}}</h1>
`,
})
Vue.component('part-title', {
  props: ['name'],
  template: `
<h2>{{name}}</h2>
`,
})
Vue.component('chapter-title', {
  props: ['name'],
  template: `
<h3>Chapter X: {{name}}</h3>
`,
})
Vue.component('section-title', {
  props: ['name'],
  template: `
<h4>{{name}}</h4>
`,
})
