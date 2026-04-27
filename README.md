# PhotoBooth Arcade

A lightweight English-language PhotoBooth website built with plain HTML, CSS, and JavaScript.

## Features

- Live webcam preview with six visual style presets
- Four-shot PhotoBooth capture flow with countdown
- Three different print layouts
- Download the final result as a PNG
- Session gallery for quick re-downloads
- Separated folder structure for easier maintenance

## Folder structure

```text
.
|-- index.html
|-- README.md
`-- src
    |-- css
    |   |-- animations.css
    |   |-- base.css
    |   |-- components.css
    |   |-- layout.css
    |   `-- variables.css
    `-- js
        |-- app.js
        |-- state.js
        |-- data
        |   |-- styles.js
        |   `-- templates.js
        `-- modules
            |-- camera.js
            |-- capture-session.js
            |-- effects.js
            |-- renderer.js
            `-- ui.js
```

## Running locally

Open `index.html` directly, or serve the folder on `localhost` with any static server.

Camera APIs work best from a secure context. In modern browsers that usually means:

- `http://localhost`
- `https://...`
- Some browsers also allow `file:///`, but `localhost` is the safest option

If you already have Python installed, one simple option is:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
