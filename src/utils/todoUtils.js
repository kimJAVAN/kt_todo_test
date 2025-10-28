// 할 일 필터링 함수
export const filterTodos = (todos, filter, searchTerm) => {
  let filtered = [...todos];

  // 검색어로 필터링
  if (searchTerm.trim()) {
    filtered = filtered.filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 필터 조건에 따라 필터링
  switch (filter) {
    case 'active':
      return filtered.filter(todo => !todo.completed);
    case 'completed':
      return filtered.filter(todo => todo.completed);
    case 'high':
      return filtered.filter(todo => todo.priority === 'high');
    case 'overdue':
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return filtered.filter(todo => 
        todo.dueDate && 
        !todo.completed && 
        new Date(todo.dueDate) < today
      );
    default:
      return filtered;
  }
};

// 할 일 정렬 함수
export const sortTodos = (todos, sortBy) => {
  const sorted = [...todos];

  switch (sortBy) {
    case 'priority':
      return sorted.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1, none: 0 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case 'alphabetical':
      return sorted.sort((a, b) => a.text.localeCompare(b.text));
    case 'created':
    default:
      return sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA; // 최신순
      });
  }
};

// 할 일 통계 계산 함수
export const calculateStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // 우선순위별 통계
  const priorityStats = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length,
    none: todos.filter(todo => !todo.priority).length
  };

  // 카테고리별 통계
  const categoryStats = todos.reduce((acc, todo) => {
    const category = todo.category || '기타';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // 마감일 관련 통계
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const overdue = todos.filter(todo => 
    todo.dueDate && 
    !todo.completed && 
    new Date(todo.dueDate) < today
  ).length;

  const todayDeadline = todos.filter(todo => 
    todo.dueDate && 
    !todo.completed && 
    new Date(todo.dueDate).toDateString() === today.toDateString()
  ).length;

  return {
    total,
    completed,
    active,
    completionRate,
    priorityStats,
    categoryStats,
    overdue,
    todayDeadline
  };
};

// 할 일 검증 함수
export const validateTodo = (todo) => {
  const errors = [];

  if (!todo.text || todo.text.trim().length === 0) {
    errors.push('할 일 내용을 입력해주세요.');
  }

  if (todo.text && todo.text.trim().length > 200) {
    errors.push('할 일 내용은 200자를 초과할 수 없습니다.');
  }

  if (todo.dueDate && new Date(todo.dueDate) < new Date().setHours(0, 0, 0, 0)) {
    errors.push('마감일은 오늘 이후로 설정해주세요.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// 할 일 내보내기 함수 (JSON)
export const exportTodos = (todos) => {
  const dataStr = JSON.stringify(todos, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 할 일 가져오기 함수 (JSON)
export const importTodos = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const todos = JSON.parse(e.target.result);
        resolve(todos);
      } catch (error) {
        reject(new Error('유효하지 않은 JSON 파일입니다.'));
      }
    };
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsText(file);
  });
};

// 할 일 텍스트 내보내기 함수
export const exportTodosAsText = (todos) => {
  const text = todos.map((todo, index) => {
    const status = todo.completed ? '✅' : '⏳';
    const priority = todo.priority ? `[${todo.priority}]` : '';
    const category = todo.category ? `(${todo.category})` : '';
    const dueDate = todo.dueDate ? ` - ${new Date(todo.dueDate).toLocaleDateString()}` : '';
    
    return `${index + 1}. ${status} ${todo.text} ${priority} ${category}${dueDate}`;
  }).join('\n');

  const dataBlob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `todos-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
