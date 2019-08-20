const express = require("express");
const server = express();

server.use(express.json());

let projectsList = [];
let requestsCounter = 0;

function checkProjectId(req, res, next) {
  const { id } = req.params;
  const project = projectsList.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project id not found !" });
  }

  return next();
}

server.use((req, res, next) => {
  requestsCounter++;
  console.log(`Total Requests ==> ${requestsCounter}`);
  return next();
});

//Get all Projects
server.get("/projects", (req, res) => {
  return res.json(projectsList);
});

//Create one Project
server.post("/projects/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  projectsList.push({
    id,
    title,
    tasks: []
  });

  return res.json(projectsList);
});

//Update Project Title By ID
server.put("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projectsList.find(p => p.id == id);
  project.title = title;

  return res.json(projectsList);
});

//Delete one project by ID
server.delete("/projects/:id", checkProjectId, (req, res) => {
  const { id } = req.params;
  const arrayPosition = projectsList.findIndex(p => p.id == id);

  projectsList.splice(arrayPosition, 1);

  return res.json(projectsList);
});

// Add Tasks into one Project By ID
server.post("/projects/:id/tasks", checkProjectId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projectsList.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projectsList);
});

server.listen(3001, () => {
  console.log("Servidor escutando porta 3001");
});
