const mysql = require("mysql2");
const inquirer = require("inquirer");


const db = mysql.createConnection(
    {
    host: 'localhost',
    user: 'root',
    password: '$h1ft3dD',
    database: 'hr_db'
    },
    console.log(`Connect to the employee database`)
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
                "View All Employees",
                "Add a Department",
                "Add a Role",
                "Add an Employee",
                "Update an Employee Role"
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
            case "View All Employees":
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
            case "Update an Employee Role":
                editEmployeeRole();
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
    db.query(`SELECT * FROm employee`, (err, res) => {
        if (err) throw err;
        console.table(res);
        startMenu();
    })
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