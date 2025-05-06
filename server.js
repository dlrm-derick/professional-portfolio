const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

// Servir carpetas estáticas necesarias:
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/recursos', express.static(path.join(__dirname, 'recursos')));

// Servir el index.html desde la raíz:
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// api de  GitHub:
app.get("/pinned", async (req, res) => {
  const query = `
    {
      user(login: "dlrm-derick") {
        pinnedItems(first: 6, types: REPOSITORY) {
          nodes {
            ... on Repository {
              name
              description
              url
              primaryLanguage {
                name
              }
              url
              openGraphImageUrl
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  res.json(data.data.user.pinnedItems.nodes);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});