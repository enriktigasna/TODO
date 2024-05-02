const cors = require('cors')
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors())

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

app.post('/todo', async (req, res) => {
    try {
        let note = await prisma.todo.create({
            data: {
                todoText: req.body.todoText,  // Changed to match the schema
                deadline: req.body.deadline,
                done: false,
            },
        });
        res.json(note);
    } catch (error) {
        res.status(500).send({ message: "Error creating todo item", error: error.message });
    }
});

app.get('/todo', async (req, res) => {
    try {
        let notes = await prisma.todo.findMany();
        res.json(notes);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving todo items", error: error.message });
    }
});

app.put('/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedNote = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: {
                todoText: req.body.todoText,
                deadline: req.body.deadline,
                done: req.body.done,
            },
        });
        res.json(updatedNote);
    } catch (error) {
        res.status(500).send({ message: "Error updating todo item", error: error.message });
    }
});

app.delete('/todo/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.todo.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // 204 No Content, indicates successful deletion without sending a body.
    } catch (error) {
        res.status(500).send({ message: "Error deleting todo item", error: error.message });
    }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
