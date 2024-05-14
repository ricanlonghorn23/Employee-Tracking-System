const inquirer = require('inquirer');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'employees_db',
  password: 'Golf123',
  port: 5432,
});


async function startApp() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: [
        'View all employees',
        'Add an employee',
        'Update an employee role',
        'View all roles',
        'Add a role',
        'View all departments',
        'Add a department',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View all employees':
      viewEmployees();
      break;
      case 'Add an employee':
      addEmployee();
      break;
      case 'Update an employee role':
      updateEmployeeRole();
      break;
      case 'View all roles':
      viewRoles();
      break;
      case 'Add a role':
      addRole();
      break;
    case 'View all departments':
      viewDepartments();
      break;
    case 'Add a department':
      addDepartment();
      break;
    case 'Exit':
      pool.end();
      console.log('Goodbye!');
      process.exit(0);
  }
}

async function viewDepartments() {
  const departments = await pool.query('SELECT * FROM departments');
  console.table(departments.rows);
  startApp();
}

async function viewRoles() {
  const roles = await pool.query(`
  SELECT r.id, r.title, r.salary, d.name AS department
  FROM roles r
  JOIN departments d ON r.department_id = d.id
`);
  console.table(roles.rows);
  startApp();
}

async function viewEmployees() {
  const employees = await pool.query(`
  SELECT 
    e.first_name,
    e.last_name,
    r.title AS role_title,
    d.name AS department_name,
    r.salary,
    COALESCE(CONCAT(m.first_name, ' ', m.last_name), 'null') AS manager_name
  FROM employees e
  JOIN roles r ON e.role_id = r.id
  JOIN departments d ON r.department_id = d.id
  LEFT JOIN employees m ON e.manager_id = m.id
`);
  console.table(employees.rows);
  startApp();
}

async function addDepartment() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the name of the department:',
      name: 'name',
    },
  ]);
  await pool.query('INSERT INTO departments (name) VALUES ($1)', [name]);
  console.log('Department added successfully!');
  startApp();
}

async function addRole() {
  const departments = await pool.query('SELECT * FROM departments');
  const departmentChoices = departments.rows.map((dept) => ({
    name: dept.name,
    value: dept.id,
  }));

  const { title, salary, department } = await inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the title of the role:',
      name: 'title',
    },
    {
      type: 'number',
      message: 'Enter the salary for this role:',
      name: 'salary',
    },
    {
      type: 'list',
      message: 'Select the department for this role:',
      name: 'department',
      choices: departmentChoices,
    },
  ]);

  await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [
    title, 
    salary, 
    department,
  ]);
  console.log('Role added successfully!');
  startApp();
}

async function addEmployee() {
  const roles = await pool.query('SELECT * FROM roles');
  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const employees = await pool.query('SELECT * FROM employees');
  const managerChoices = employees.rows.map((emp) => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id,
  }));

  managerChoices.unshift({ name: 'None', value: null });

  const { first_name, last_name, role, manager } = await inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the employee\'s first name:',
      name: 'first_name',
    },
    {
      type: 'input',
      message: 'Enter the employee\'s last name:',
      name: 'last_name',
    },
    {
      type: 'list',
      message: 'Select the employee\'s role:',
      name: 'role',
      choices: roleChoices,
    },
    {
      type: 'list',
      message: 'Select the employee\'s manager:',
      name: 'manager',
      choices: managerChoices,
    },
  ]);

  await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [
    first_name,
    last_name,
    role,
    manager,
  ]);
  console.log('Employee added successfully!');
  startApp();
}

async function updateEmployeeRole() {
  const employees = await pool.query('SELECT * FROM employees');
  const employeeChoices = employees.rows.map((emp) => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id,
  }));

  const roles = await pool.query('SELECT * FROM roles');
  const roleChoices = roles.rows.map((role) => ({
    name: role.title,
    value: role.id,
  }));

  const { employeeId, roleId } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select the employee whose role you want to update:',
      name: 'employeeId',
      choices: employeeChoices,
    },
    {
      type: 'list',
      message: 'Select the new role for the employee:',
      name: 'roleId',
      choices: roleChoices,
    },
  ]);

  await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2', [roleId, employeeId]);
  console.log('Employee role updated successfully!');
  startApp();
}

startApp();
