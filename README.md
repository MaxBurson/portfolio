# Portfolio

Plain HTML/CSS/JS: no build step, no installs.

## Run it
Double-click **start.cmd**. It starts a local server and opens http://localhost:5173.
Close the server window to stop it.

## Edit your content
Everything you'd want to change is in **data.js**: name, intro, projects, about, experience, socials.
Save the file and refresh the browser.

- `*word*` → italic serif accent
- Project screenshots: drop images in an `images/` folder and set `image: "images/name.jpg"`
- Portrait: `about.portrait: "images/me.jpg"`
- Résumé: put `resume.pdf` in this folder and set `resume: "resume.pdf"`

## Files
- `index.html`: page structure
- `styles.css`: design tokens (colours, fonts) are at the top
- `main.js`: cursor, animations, rendering
- `serve.ps1`: tiny local web server
