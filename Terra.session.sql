CREATE TABLE issues(
    id CHAR(36) PRIMARY KEY,
    project_id CHAR(36) NOT NULL,
    description TEXT NOT NULL,
    issue_type ENUM('task', 'bug', 'story') NOT NULL DEFAULT 'task',
    status ENUM('todo', 'in_progress', 'in_review', 'done') NOT NULL DEFAULT 'todo',
    priority ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium',
    reporter_id CHAR(36) NOT NULL,
    reporter_uname CHAR(50) NOT NULL,
    assignee_id CHAR(36) NULL,
    assignee_uname CHAR(50) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reporter_uname) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE
    SET NULL,
        FOREIGN KEY (assignee_uname) REFERENCES users(username) ON DELETE
    SET NULL
);