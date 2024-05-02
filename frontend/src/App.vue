<template>
  <div id="app">
    <h1>Todo Notes</h1>
    <div>
      <input v-model="newNote" placeholder="Enter a new todo note" @keyup.enter="addTodo"/>
      <button @click="addTodo">Add Todo</button>
    </div>
    <ul>
      <li class="TODO" v-for="note in notes" :key="note.id">
        <span>{{ note.todoText }} - {{ note.deadline }} - {{ note.done ? 'Completed' : 'Pending' }}</span>
        <button @click="deleteTodo(note)">Delete</button>
        <button @click="editNote(note)">Edit</button>
        <button @click="toggleCompleted(note)">{{ note.done ? "Uncomplete" : "Complete" }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      notes: [],
      newNote: ''
    };
  },
  mounted() {
    this.fetchTodos();
  },
  methods: {
    fetchTodos() {
      axios.get('http://localhost:3000/todo')
        .then(response => {
          this.notes = response.data;
        })
        .catch(error => {
          console.error("There was an error fetching the todos:", error);
        });
    },
    addTodo() {
      if (this.newNote.trim()) {
        axios.post('http://localhost:3000/todo', {
          todoText: this.newNote,
          deadline: new Date().toISOString()  // Adjust this as needed
        })
        .then(response => {
          this.notes.push(response.data);
          this.newNote = ''; // Clear the input after adding
        })
        .catch(error => {
          console.error("There was an error adding the todo:", error);
        });
      }
    },
  deleteTodo(note) {
    axios.delete(`http://localhost:3000/todo/${note.id}`)
      .then(() => {
        this.notes = this.notes.filter(n => n.id !== note.id);
      })
      .catch(error => {
        console.error("There was an error deleting the todo:", error);
      });
  },
  editNote(note){
    // Open a popup to edit the note
    const editedNote = prompt("Edit the note:", note.todoText);
    if (editedNote !== null) {
      note.todoText = editedNote;
      axios.put(`http://localhost:3000/todo/${note.id}`, note)
        .then(() => {
          this.fetchTodos();
        })
        .catch(error => {
          console.error("There was an error updating the todo:", error);
        });
    }
  },
  toggleCompleted(note) {
    note.done = !note.done;
    axios.put(`http://localhost:3000/todo/${note.id}`, note)
      .then(() => {
        this.fetchTodos();
      })
      .catch(error => {
        console.error("There was an error updating the todo:", error);
      });
  }
}
};
</script>

<style>
#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
button {
  margin-left: 10px;
}
</style>
