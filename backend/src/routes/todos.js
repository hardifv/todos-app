const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'El título es requerido' });
  }

  try {
    const newTask = await prisma.task.create({
      data: { title }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar una tarea por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, completed }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Eliminar una tarea por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

module.exports = router;
