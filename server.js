// server.js
import express from "express";
import { h } from "preact";
import render from "preact-render-to-string";
import path from "path";
import Application from "./build/ssr-build/ssr-bundle";

const app = express();

const HTMLShell = (html) => `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title> SSR Preact App </title>
            <link rel="stylesheet" href="./bundle.82271.css" />
        </head>
        <body>
            <div id="app">${html}</div>
            <script src="./bundle.9676f.esm.js"></script>
        </body>
    </html>`;

app.use(express.static(path.join(__dirname, "build")));

app.get("**", (req, res) => {
  let html = render(<Application />);
  console.log(html);

  res.send(HTMLShell(html));
});

app.listen(4000, (err) => {
  console.log("server has started!");
});
