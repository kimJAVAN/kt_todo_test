import React, { useState } from 'react';
import './TodoForm.css';

const TodoForm = ({ onAddTodo, editingTodo, onUpdateTodo, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    text: editingTodo?.text || '',
    priority: editingTodo?.priority || 'none',
    category: editingTodo?.category || 'none',
    dueDate: editingTodo?.dueDate || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text.trim()) return;

    const todoData = {
      text: formData.text.trim(),
      completed: editingTodo?.completed || false,
      priority: formData.priority === 'none' ? null : formData.priority,
      category: formData.category === 'none' ? null : formData.category,
      dueDate: formData.dueDate || null,
      createdAt: editingTodo?.createdAt || new Date().toISOString()
    };

    if (editingTodo) {
      onUpdateTodo(editingTodo.index, todoData);
    } else {
      onAddTodo(todoData);
    }

    // 폼 초기화
    setFormData({
      text: '',
      priority: 'none',
      category: 'none',
      dueDate: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      text: '',
      priority: 'none',
      category: 'none',
      dueDate: ''
    });
    if (onCancelEdit) onCancelEdit();
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>{editingTodo ? '할 일 수정' : '새 할 일 추가'}</h3>
        {editingTodo && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            ✕
          </button>
        )}
      </div>
      
      <div className="form-group">
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="할 일을 입력하세요..."
          className="todo-input"
          required
        />
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label>우선순위</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="none">우선순위 없음</option>
            <option value="low">낮음</option>
            <option value="medium">보통</option>
            <option value="high">높음</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>카테고리</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="none">카테고리 없음</option>
            <option value="work">업무</option>
            <option value="personal">개인</option>
            <option value="shopping">쇼핑</option>
            <option value="health">건강</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label>마감일</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleInputChange}
          className="form-input"
        />
      </div>
      
      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {editingTodo ? '수정' : '추가'}
        </button>
        {editingTodo && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
