const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

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
                openGraphImageUrl  # <-- este campo añade la imagen
              }
            }
          }
        }
      }
    `;

  // envia la consulta a la API de GitHub
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
    },
    body: JSON.stringify({ query })
  });

  const data = await response.json();
  res.json(data.data.user.pinnedItems.nodes);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});