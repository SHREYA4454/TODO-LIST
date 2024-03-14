import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');
  const [submittedTodo, setSubmittedTodo] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);

  useEffect(() => {
    axios.get('/todos')
      .then(res => {
        setTodos(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/todos', { text });
      setTodos([...todos, response.data]);
      setText('');
      setSubmittedTodo(response.data.text);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleDelete = (id) => {
    axios.delete(`/todos/${id}`)
      .then(() => {
        setTodos(todos.filter(todo => todo.id !== id));
      })
      .catch(err => console.log(err));
  };

const handleComplete = (id) => {
  const updatedTodos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  setTodos(updatedTodos);

  const completedTodo = updatedTodos.find(todo => todo.id === id); // Look for the completed todo in the updated todos
  if (completedTodo && completedTodo.completed) {
    setCompletedTodos(prevCompletedTodos => [...prevCompletedTodos, completedTodo]); // Add the completed todo to completedTodos
  } else {
    setCompletedTodos(prevCompletedTodos => prevCompletedTodos.filter(todo => todo.id !== id)); // Remove the completed todo from completedTodos
  }
};


  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return todo.completed;
    } else {
      return !todo.completed;
    }
  });

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input type="text" value={text} onChange={handleChange} placeholder="Add new todo..." />
        <button type="submit">Add Todo</button>
      </form>
      {submittedTodo && <p className="submitted-todo">You added: {submittedTodo}</p>}
      <div className="filter-buttons">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'completed' ? 'active' : ''} onClick={() => setFilter('completed')}>Completed</button>
      </div>
      <h2>Completed Todos</h2>
      <ul className="completed-todos">
        {completedTodos.map(todo => (
          <li key={todo.id}>
            <span className="completed-todo-text">{todo.text}</span>
            <span className="completed-todo-status">✔️</span>
          </li>
        ))}
      </ul>
      <h2>Todo List</h2>
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <span className="todo-text" onClick={() => handleComplete(todo.id)}>
              {todo.text}
            </span>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
