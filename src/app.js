const express = require('express');
const cors = require('cors');

const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyUUID(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({
      message: 'Id Errado',
    });
  }
  return next();
}

app.get('/repositories', (request, response) => {
  return response.status(200).json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;
  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(project);
  return response.status(200).json(project);
});

app.put('/repositories/:id', verifyUUID, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex((project) => project.id == id);

  if (index < 0) {
    return response.status(400).json({ message: 'Nao encontrado' });
  }
  const project = {
    id: repositories[index].id,
    title,
    url,
    techs,
    likes: repositories[index].likes,
  };
  repositories[index] = project;

  return response.status(200).json(project);
});

app.delete('/repositories/:id', verifyUUID, (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((project) => project.id == id);

  if (index < 0) {
    return response.status(400).json({ message: 'Nao encontrado' });
  }
  repositories.splice(index, 1);
  return response.status(204).json();
});

app.post('/repositories/:id/like', verifyUUID, (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((project) => project.id == id);

  if (index < 0) {
    return response.status(400).json({ message: 'Nao encontrado' });
  }
  const project = {
    id: repositories[index].id,
    title: repositories[index].title,
    url: repositories[index].url,
    techs: repositories[index].techs,
    likes: repositories[index].likes + 1,
  };
  repositories[index] = project;
  return response.status(200).json(project);
});

module.exports = app;
