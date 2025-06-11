// src/routes/task.routes.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticate from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware para todas las rutas: autenticar
router.use(authenticate);

// Obtener todas las tareas del usuario
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'El título es requerido' });

  try {
    const task = await prisma.task.create({
      data: {
        title,
        userId: req.user.userId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
});

// Actualizar una tarea
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask || existingTask.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title }),
        ...(completed !== undefined && { completed }),
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTask || existingTask.userId !== req.user.userId) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await prisma.task.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
});

export default router;
