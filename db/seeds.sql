use hr_db;

INSERT INTO department (name)
VALUES 
    ("Management"),
    ("Operations"),
    ("Customer Success"),
    ("DevOps"),
    ("QA"),
    ("Finance")

INSERT INTO role (title, salary, department_id)
VALUES 
    ("CEO", 270000, 1),
    ("CTO", 250000, 1),
    ("CFO", 220000, 1),
    ("CSO", 160000, 1),
    ("CMO", 140000, 1),
    ("Product Manager", 110000, 2),
    ("Project Manager", 110000, 2),
    ("Product Designer", 125000, 2),
    ("UX Designer", 90000, 2),
    ("Customer Success Manager", 120000, 3),
    ("Marketing Specialist", 90000, 3),
    ("Sales Specialist", 75000, 3),
    ("Engineering Lead", 120000, 4),
    ("Cloud Architect", 115000, 4),
    ("SRE Specialist", 90000, 4),
    ("System Administrator", 100000, 4),
    ("QA Lead", 110000, 5),
    ("QA Analyst", 90000, 5),
    ("QA Tester", 65000, 5),
    ("Accountant", 130000, 6),
    ("Talent Acquisition Specialist", 110000, 6),
    ("Office Administrator", 70000, 6)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Ron", "Swanson", 1, NULL),
    ("Leslie", "Knope", 5, 1),
    ("Ben", "Wyatt", 3, 1),
    ("Tom", "Haverford", 11, 5),
    ("Donna", "Meagle", 10, 5),
    ("April", "Ludgate", 22, 1),
    ("Andy", "Dwyer", 12, 5),
    ("Terry", "Gergich", 19, 2),
    ("Ann", "Perkins", 21, 1),
    ("Jean-Ralphio", "Saperstein", 10, 5)