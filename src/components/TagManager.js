import React, { useState } from 'react';
import './TagManager.css';

const TagManager = ({ todos, onTagFilter, selectedTags }) => {
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  // 모든 태그 추출
  const getAllTags = () => {
    const tagSet = new Set();
    todos.forEach(todo => {
      if (todo.tags && Array.isArray(todo.tags)) {
        todo.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  };

  const allTags = getAllTags();

  // 태그별 할 일 개수 계산
  const getTagCount = (tag) => {
    return todos.filter(todo => 
      todo.tags && todo.tags.includes(tag)
    ).length;
  };

  // 태그별 완료된 할 일 개수 계산
  const getCompletedTagCount = (tag) => {
    return todos.filter(todo => 
      todo.tags && todo.tags.includes(tag) && todo.completed
    ).length;
  };

  // 태그 필터 토글
  const toggleTagFilter = (tag) => {
    if (selectedTags.includes(tag)) {
      onTagFilter(selectedTags.filter(t => t !== tag));
    } else {
      onTagFilter([...selectedTags, tag]);
    }
  };

  // 모든 태그 선택/해제
  const toggleAllTags = () => {
    if (selectedTags.length === allTags.length) {
      onTagFilter([]);
    } else {
      onTagFilter([...allTags]);
    }
  };

  // 태그 색상 생성
  const getTagColor = (tag) => {
    const colors = [
      '#e74c3c', '#3498db', '#2ecc71', '#f39c12', 
      '#9b59b6', '#1abc9c', '#e67e22', '#34495e',
      '#e91e63', '#3f51b5', '#4caf50', '#ff9800'
    ];
    const hash = tag.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="tag-manager">
      <div className="tag-manager-header">
        <h3>🏷️ 태그 관리</h3>
        <div className="tag-controls">
          <button 
            onClick={toggleAllTags}
            className="toggle-all-btn"
          >
            {selectedTags.length === allTags.length ? '전체 해제' : '전체 선택'}
          </button>
          <button 
            onClick={() => setShowTagInput(!showTagInput)}
            className="add-tag-btn"
          >
            + 태그 추가
          </button>
        </div>
      </div>

      {showTagInput && (
        <div className="tag-input-section">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="새 태그 이름을 입력하세요..."
            className="tag-input"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newTag.trim()) {
                // 새 태그를 첫 번째 할 일에 추가 (예시)
                setNewTag('');
                setShowTagInput(false);
              }
            }}
          />
          <button 
            onClick={() => {
              setNewTag('');
              setShowTagInput(false);
            }}
            className="cancel-btn"
          >
            취소
          </button>
        </div>
      )}

      <div className="tag-list">
        {allTags.length === 0 ? (
          <div className="no-tags">
            <p>아직 태그가 없습니다.</p>
            <p>할 일에 태그를 추가해보세요!</p>
          </div>
        ) : (
          allTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            const totalCount = getTagCount(tag);
            const completedCount = getCompletedTagCount(tag);
            const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <div
                key={tag}
                className={`tag-item ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleTagFilter(tag)}
                style={{ borderLeftColor: getTagColor(tag) }}
              >
                <div className="tag-info">
                  <span 
                    className="tag-name"
                    style={{ color: getTagColor(tag) }}
                  >
                    #{tag}
                  </span>
                  <div className="tag-stats">
                    <span className="tag-count">
                      {completedCount}/{totalCount}
                    </span>
                    <span className="completion-rate">
                      ({completionRate}%)
                    </span>
                  </div>
                </div>
                <div className="tag-progress">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${completionRate}%`,
                      backgroundColor: getTagColor(tag)
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="selected-tags-info">
          <p>
            <strong>{selectedTags.length}</strong>개 태그 선택됨: 
            {selectedTags.map(tag => (
              <span key={tag} className="selected-tag">
                #{tag}
              </span>
            ))}
          </p>
          <button 
            onClick={() => onTagFilter([])}
            className="clear-selection-btn"
          >
            선택 해제
          </button>
        </div>
      )}
    </div>
  );
};

export default TagManager;
