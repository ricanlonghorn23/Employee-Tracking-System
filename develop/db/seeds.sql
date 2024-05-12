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
  ('Alice', 'Johnson', 3, 1);
