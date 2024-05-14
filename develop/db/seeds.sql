INSERT INTO departments (name) VALUES
  ('Desk Adjuster Claims'),
  ('Catastrophe Claims'),
  ('Field Claims');

INSERT INTO roles (title, salary, department_id) VALUES
  ('Associate Property Adjuster', 50000, 1),
  ('Property Adjuster', 60000, 2),
  ('Senior Property Adjuster', 70000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Alice', 'Johnson', 3, 2);

INSERT INTO managers (first_name, last_name) VALUES
  ('Randy', 'Akers');
 
SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS role_title, d.name AS department_name,
       m.first_name AS manager_first_name, m.last_name AS manager_last_name
FROM employees e
JOIN roles r ON e.role_id = r.id
JOIN departments d ON r.department_id = d.id
LEFT JOIN employees m ON e.manager_id = m.id;