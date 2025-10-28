import React, { useState } from 'react';
import './App.css';
import AdvancedTodoApp from './AdvancedTodoApp';
import SimpleAdvancedTodo from './SimpleAdvancedTodo';

function App() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useSimpleVersion, setUseSimpleVersion] = useState(true);
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  if (showAdvanced) {
    return (
      <div className="App">
        <div className="app-switcher">
          <button 
            onClick={() => setShowAdvanced(false)}
            className="switch-btn"
          >
            ← 기본 Todo로 돌아가기
          </button>
          <button 
            onClick={() => setUseSimpleVersion(!useSimpleVersion)}
            className="switch-btn"
            style={{ marginLeft: '10px' }}
          >
            {useSimpleVersion ? '고급 버전' : '간단 버전'}
          </button>
        </div>
        {useSimpleVersion ? <SimpleAdvancedTodo /> : <AdvancedTodoApp />}
      </div>
    );
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue('');
    }
  };

  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleToggleTodo = (index) => {
    const newTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(newTodos);
  };

  return (
    <div className="App">
      <div className="app-switcher">
        <button 
          onClick={() => setShowAdvanced(true)}
          className="switch-btn advanced"
        >
          🚀 고급 Todo 앱 사용하기
        </button>
      </div>
      
      <h1>기본 Todo App</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new todo"
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => handleToggleTodo(index)}>{todo.text}</span>
            <button onClick={() => handleDeleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;