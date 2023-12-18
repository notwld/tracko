CREATE DATABASE tracko;

USE tracko;

CREATE TABLE user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE scrum_master (
    scrum_master_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE product_owner (
    product_owner_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE developers (
    developer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    velocity INT NOT NULL,
    interrupt_hours INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    product_owner_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    project_description TEXT,
    project_start_date DATE,
    project_end_date DATE,
    project_status VARCHAR(255),
    scrumboard_id INT,
    FOREIGN KEY (product_owner_id) REFERENCES product_owner(product_owner_id)
);

CREATE TABLE product_backlog (
    backlog_id INT PRIMARY KEY AUTO_INCREMENT,
    product_owner_id INT NOT NULL,
    project_id INT NOT NULL,
    backlog_name VARCHAR(255) NOT NULL,
    backlog_description TEXT,
    FOREIGN KEY (product_owner_id) REFERENCES product_owner(product_owner_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE sprint (
    sprint_id INT PRIMARY KEY AUTO_INCREMENT,
    sprint_name VARCHAR(255) NOT NULL,
    sprint_start_date DATE,
    sprint_end_date DATE,
    sprint_status VARCHAR(255),
    project_id INT NOT NULL,
    maximum_velocity INT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE sprint_backlog (
    sprint_backlog_id INT PRIMARY KEY AUTO_INCREMENT,
    sprint_id INT NOT NULL,
    backlog_id INT NOT NULL,
    backlog_status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (sprint_id) REFERENCES sprint(sprint_id),
    FOREIGN KEY (backlog_id) REFERENCES product_backlog(backlog_id)
);

CREATE TABLE session (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    attendee_id INT NOT NULL,
    chat_id INT NOT NULL,
    session_start_time DATETIME,
    session_end_time DATETIME,
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE project_team (
    project_team_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    developer_id INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (developer_id) REFERENCES developers(developer_id)
);

CREATE TABLE project_selection (
    project_selection_id INT PRIMARY KEY AUTO_INCREMENT,
    developer_id INT NOT NULL,
    project_id INT NOT NULL,
    date_selected DATE,
    FOREIGN KEY (developer_id) REFERENCES developers(developer_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE task (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    sprint_id INT NOT NULL,
    user_id INT NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    task_description TEXT,
    task_priority INT NOT NULL,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (sprint_id) REFERENCES sprint(sprint_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE poker_planning_estimates (
    estimate_id INT PRIMARY KEY AUTO_INCREMENT,
    developer_id INT NOT NULL,
    session_id INT NOT NULL,
    project_id INT NOT NULL,
    individual_user_story_duration INT NOT NULL,
    individual_story_point INT NOT NULL,
    FOREIGN KEY (developer_id) REFERENCES developers(developer_id),
    FOREIGN KEY (session_id) REFERENCES session(session_id),
    FOREIGN KEY (project_id) REFERENCES projects(project_id)
);

CREATE TABLE attendee (
    attendee_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_id INT NOT NULL,
    role VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (session_id) REFERENCES session(session_id)
);

CREATE TABLE chat (
    chat_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    sender_attendee_id INT NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    FOREIGN KEY (session_id) REFERENCES session(session_id)
);