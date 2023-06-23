const mysql = require("mysql2");
const inquirer = require("inquirer");
const chalk = require("chalk");


const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: '$h1ft3dD',
    database: 'hr_db'
    },
    console.log(`Connected to the employee database`)
);

db.connect((err) => {
    if (err) throw err;
    
    startMenu();
});

startMenu = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "Select a menu option to review",
            choices: [
                "View All Departments",
                "View All Roles",
                "View Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee's Manager or Role",
                "Remove a Department",
                "Remove a Role",
                "Remove an Employee"
            ],
            name: "menu"
        },
    ])
    .then(response => {
        switch (response.menu) {
            case "View All Departments":
                viewDepartments();
                break;
            case "View All Roles":
                viewRoles();
                break;
            case "View Employees":
                viewEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                addRole();
                break;
            case "Add an Employee":
                addEmployee();
                break;
            case "Update an Employee's Manager or Role":
                editEmployeeRole();
                break;
            case "Remove a Department":
              removeDepartment();
              break;
            case "Remove a Role":
              removeRole();
              break;
            case "Remove an Employee":
              removeEmployee();
              break;
        }
    });
};

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
};

const viewRoles = () => {
    db.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startMenu();
    });
};

const viewEmployees = () => {
    inquirer.prompt([
        {
            type: "list",
            message: "How would you like to view employees?",
            choices: ["All Employees", "By Manager", "By Department"],
            name: "viewOption"
        },
    ])
    .then((answer) => {
        switch (answer.viewOption) {
            case "All Employees":
                db.query(`SELECT * FROM employee`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startMenu();
                });
                break;
            case "By Manager":
                db.query(`SELECT * FROM employee ORDER BY manager_id`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startMenu();
                });
                break;
            case "By Department":
                db.query(`SELECT * FROM employee JOIN role ON employee.role_id = role. id JOIN department ON role.department_id = department.id ORDER BY department.id`, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startMenu();
                });
                break;   
        }
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department you are adding?",
            name: "department"
        },
    ])
    .then(answer => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answer.department], (err, res) => {
            if (err) throw err;
            console.log("Department added!");
            startMenu();
        });
    });
};

const addRole = () => {
    
    db.query(`SELECT id, name FROM department`, (err, departments) => {
        if (err) throw err;

        const departmentOptions = departments.map((department) => ({
            name: department.name,
            value: department.id,
        }));

        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role you are adding?",
                name: "roleTitle"
            },
            {
                type: "input",
                message: "Please enter the base salary for this role using only numbers:",
                name: "salary",
                validate: (input) => {
                    const validateInput = input.replace(/[^0-9.]/g, '');
                    const numbers = /^\d+(\.\d+)?$/.test(validateInput);
                    if (numbers) {
                        return true;
                    }
                    return `Please enter a salary using only numbers.`;
                },
            },
            {
                type: "list",
                message: "What is the department this role goes under?",
                choices: departmentOptions,
                name: "departmentId"
            }
        ])
        .then(answer => {
            db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answer.roleTitle, answer.salary, answer.departmentId], (err, res) => {
                if (err) throw err;
                console.log("Job added!");
                startMenu();
            });
        });      
    })
};

const addEmployee = () => {
  db.query(`SELECT id, title FROM role`, (err, roles) => {
    if (err) throw err;

    const roleOptions = roles.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    db.query(
      `SELECT id, first_name, last_name FROM employee`,
      (err, managers) => {
        if (err) throw err;

        const managerOptions = [
          { name: "None", value: null },
          ...managers.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          })),
        ];

        inquirer
          .prompt([
            {
              type: "input",
              message: "What is the employee's first name?",
              name: "firstName",
            },
            {
              type: "input",
              message: "What is the employee's last name?",
              name: "lastName",
            },
            {
              type: "list",
              message: "What is the employee's job title?",
              choices: roleOptions,
              name: "roleId",
            },
            {
              type: "list",
              message: "Who is the employee's manager?",
              choices: managerOptions,
              name: "managerId",
            },
          ])
          .then((answer) => {
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
              [
                answer.firstName,
                answer.lastName,
                answer.roleId,
                answer.managerId,
              ],
              (err, res) => {
                if (err) throw err;
                console.log("Employee added!");
                startMenu();
              }
            );
          });
      }
    );
  });
};

const editEmployeeRole = () => {
    
      db.query(
        `SELECT id, first_name, last_name FROM employee`,
        (err, employees) => {
          if (err) throw err;
  
          const allEmployees = 
            employees.map((employee) => ({
              name: employee.first_name + " " + employee.last_name,
              value: employee.id,
            }));
        
    db.query(`SELECT id, title FROM role`, (err, roles) => {
        if (err) throw err;
    
        const roleOptions = roles.map((role) => ({
            name: role.title,
            value: role.id,
        }));

    db.query(
      `SELECT id, first_name, last_name FROM employee`,
      (err, managers) => {
        if (err) throw err;

        const managerOptions = [
          { name: "None", value: null },
          ...managers.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          })),
        ];

        
  
          inquirer
            .prompt([
              {
                type: "list",
                message: "Who'd role would you like to update?",
                choices: allEmployees,
                name: "employeeId",
              },
              {
                type: 'confirm',
                message: 'Do they have a new job title or role?',
                name: 'checkRole',
                default: true
                },
              {
                type: "list",
                message: "What is the employee\'s new job title?",
                choices: roleOptions,
                name: "roleId",
                when(answers) {
                    return answers.checkRole === true
                },
              },
              {
                type: 'confirm',
                message: 'Do they have a new manager?',
                name: 'checkManager',
                default: true
                },
                {
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managerOptions,
                    name: "managerId",
                    when(answers) {
                        return answers.checkManager === true
                    },
                  }, 

            ])
            .then((answer) => {
              db.query(
                `UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?`,
                [
                  answer.roleId,
                  answer.managerId,
                  answer.employeeId,
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employee updated!");
                  startMenu();
                }
              );
            });
        }
      );
    });
    });
  };

  const removeDepartment = () => {
    db.query(`SELECT id, name FROM department`, (err, departments) => {
      if (err) throw err;

      const departmentOptions = departments.map((department) => ({
          name: department.name,
          value: department.id,
      }));

      inquirer.prompt([
        {
          type: "list",
          message: chalk.bgRed("Which department would you like to remove?"),
          choices: departmentOptions,
          name: "departmentId",
        },
        {
          type: 'confirm',
          message: chalk.bgRed("Are you sure you want to delete this entire department?"),
          name: "confirmRemove",
          default: false,
        }
      ])
      .then((answer) => {
        if (answer.confirmRemove) {
        db.query(
          `DELETE FROM department WHERE id = ?`,[answer.departmentId],
          (err, res) => {
            if (err) throw err;
            console.log(chalk.red("Department removed!"));
            startMenu();
          }
        );
        } else {
          console.log(chalk.yellow("Removal cancelled."));
          startMenu();
        }
      });
  })
  };

  const removeRole = () => {
    db.query(`SELECT id, title FROM role`, (err, roles) => {
      if (err) throw err;
  
      const roleOptions = roles.map((role) => ({
          name: role.title,
          value: role.id,
      }));

      inquirer
            .prompt([
              {
                type: "list",
                message: chalk.bgRed("Which job title would you like to remove?"),
                choices: roleOptions,
                name: "roleId",
              },
              {
                type: 'confirm',
                message: chalk.bgRed("Are you sure you want to delete this job?"),
                name: "confirmRemove",
                default: false,
              }
            ])
            .then((answer) => {
              if (answer.confirmRemove) {
              db.query(
                `DELETE FROM role WHERE id = ?`,[answer.roleId],
                (err, res) => {
                  if (err) throw err;
                  console.log(chalk.red("Role removed!"));
                  startMenu();
                }
              );
              } else {
                console.log(chalk.yellow("Removal cancelled."));
                startMenu();
              }
            });
    })
    };

  const removeEmployee = () => {
    db.query(
      `SELECT id, first_name, last_name FROM employee`,
      (err, employees) => {
        if (err) throw err;

        const allEmployees = 
          employees.map((employee) => ({
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          }));

      inquirer.prompt([
        {
          type: "list",
          message: chalk.bgRed("Which employee would you like to remove?"),
          choices: allEmployees,
          name: "employeeId",
        },
        {
          type: 'confirm',
          message: chalk.bgRed("Are you sure you want to delete this employee from the database?"),
          name: "confirmRemove",
          default: false,
        }
      ])
      .then((answer) => {
        if (answer.confirmRemove) {
        db.query(
          `DELETE FROM employee WHERE id = ?`,[answer.employeeId],
          (err, res) => {
            if (err) throw err;
            console.log(chalk.red("Employee removed!"));
            startMenu();
          }
        );
        } else {
          console.log(chalk.yellow("Removal cancelled."));
          startMenu();
        }
      });
  })
  }