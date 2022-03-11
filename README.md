# campaigner

Dungeons & Dragons campaign building and documentation library. Heavily inspired by [DND 5e LaTeX Template by rpgtex](https://github.com/rpgtex/DND-5e-LaTeX-Template). It is a great library and very easy to use, if you are familiar with LaTeX. However, I wasn't happy with pdfs, especially with pdf reader performance with large documents. Jumping from page to another was not great user experience for the DM, so I thought I could try improving things before my next campaign. I want DM's job to be easier so there is more time for improvising and coming up with fun ideas during sessions. I researched options to transpile LaTeX to HTML, but I couldn't find any that worked well enough. I also wanted to make it easy to use, so I thought LaTeX might not be the best option for most people.

**Features**

- HTML id based linking to monsters, areas, parts, chapters, sections, etc.
- Vue 2 components that are pretty close to the style of D&D 5th ed.
- Builds only one HTML file with everything included inline.
- Fancy Table of Contents.
- [A simple example campaign](https://jjaanila.github.io/campaigner/).
- Party tracker.
- Combat tracker.
- JSON schema for defining campaign document and monsters.
- Can be installed via npm or used as a template repository.

See Issues for planned features.

## Installation

`npm install campaigner`

See `./src/example` and `./campaign.js` for an example campaign.

## Structure

### campaign.js

A file in the project root that defines the structure and metadata of the campaign document. See `src/schemas/campaign.json` for file schema.

- Campaign metadata, e.g. cover page information
- Parts, Chapters, and Sections. Used (so far) only for generating Table of Contents.
- Monsters

### Components

Vue 2 components in `src/components` for creating a nice looking campaign site.

## Development

```bash
# install dependencies
npm install

# serve with HMR at http://localhost:8080
npm start

# validate current campaign.js against the JSON schema
npm run validate
```

## External Resources

### Icons

Delapouite, https://delapouite.com: backpack.svg, notebook.svg
Lorc, https://lorcblog.blogspot.com/: cycle.svg
