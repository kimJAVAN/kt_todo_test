import React, { useState } from 'react';

const SimpleAdvancedTodo = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false,
        priority: 'medium',
        category: 'personal'
      }]);
      setInputValue('');
    }
  };

  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#333',
        marginBottom: '30px'
      }}>
        🚀 고급 Todo 앱 (간단 버전)
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="새로운 할 일을 입력하세요..."
          style={{
            flex: 1,
            maxWidth: '400px',
            padding: '12px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        />
        <button
          onClick={handleAddTodo}
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          추가
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>
          할 일 목록 ({todos.length}개)
        </h3>

        {todos.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <p>아직 할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
          </div>
        ) : (
          <div>
            {todos.map(todo => (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  margin: '8px 0',
                  backgroundColor: todo.completed ? '#f0f0f0' : '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                  style={{ width: '18px', height: '18px' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#666' : '#333',
                    fontSize: '16px'
                  }}
                >
                  {todo.text}
                </span>
                <span style={{
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {todo.priority}
                </span>
                <span style={{
                  backgroundColor: '#f3e5f5',
                  color: '#7b1fa2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {todo.category}
                </span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: '12px'
      }}>
        <p style={{ margin: 0, color: '#666' }}>
          💡 이 버전은 기본 기능만 포함된 간단한 버전입니다.
        </p>
      </div>
    </div>
  );
};

export default SimpleAdvancedTodo;
