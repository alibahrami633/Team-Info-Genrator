const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const validator = require("email-validator");

const OUTPUT_DIR = path.resolve(__dirname, "output")
const outputPath = path.join(OUTPUT_DIR, "team.html");

const writeFile = util.promisify(fs.writeFile);

/**
 * @param {Array} employees Employees * 
 */
class Company {

    constructor() {
        this.employees = [];
    }

    async getInfo() {
        try {
            console.log("\n============================================================\n");
            await inquirer
                .prompt([
                    {
                        type: "input",
                        name: "role",
                        message: "Enter 'Manager' or 'Engineer' or 'Intern':",
                        validate: (val) => {
                            const input = /[mei]/gi.test(val);
                            return input ? (/[mei]/gi.test(val)) : "Enter 'Manager' or 'Engineer' or 'Intern':";
                        },
                    },
                    {
                        type: "input",
                        name: "name",
                        message: "Enter name:",
                        validate: (val) => {
                            const output = val.length ? /[a-z]/gi.test(val) : "Enter a correct name: ";
                            return output;
                        },
                    },
                    {
                        type: "input",
                        name: "email",
                        message: "Enter email:",
                        validate: (val) => {
                            const output = val.length ? validator.validate(val) : "Wrong format, enter a valid email:";
                            return output;
                        },
                    },
                    {
                        type: "input",
                        name: "id",
                        message: "Enter id:",
                        validate: (val) => {
                            const output = val.length ? /[a-z0-9]/gi.test(val) : "Enter correct ID containing 'a-z' letters and/or '0-9' numbers:";
                            return output;
                        },
                    },
                ])
                .then((response) => {
                    this.answers = response;
                    this.role = response.role.toLowerCase();
                    this.addRoleSpecificDetail();
                });
        }
        catch (err) {
            console.log(err);
        }
    }

    async addRoleSpecificDetail() {
        try {
            if (this.role === "manager") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "officeNumber",
                        message: "Office Number: ",
                        validate: (val) => {
                            const output = val.length ? /[0-9]/gi.test(val) : "Use numbers for ID: ";
                            return output;
                        },
                    })
                    .then((response) => {
                        this.manager = new Manager(this.answers.name, this.answers.id, this.answers.email, response.officeNumber);
                        this.employees.push(this.manager);
                    });
            }
            else if (this.role === "engineer") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "userName",
                        message: "Enter Github username:",
                        validate: (val) => {
                            const output = val.length ? /[a-z1-9]/gi.test(val) : "github Username: ";
                            return output;
                        },
                    })
                    .then((data) => {
                        const engineer = new Engineer(this.answers.name, this.answers.id, this.answers.email, data.userName);
                        this.employees.push(engineer);
                    });
            }
            else if (this.role === "intern") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "schoolName",
                        message: "School Name:",
                        validate: (val) => {
                            const output = val.length ? /[a-z1-9]/gi.test(val) : "School Name: ";
                            return output;
                        },
                    })
                    .then((data) => {
                        const intern = new Intern(this.answers.name, this.answers.id, this.answers.email, data.schoolName);
                        this.employees.push(intern);
                    });
            }
        }
        catch (err) {
            console.log(err);
        }

        this.moreEntry();
    }

    /** Adds more employees based on user request */
    async moreEntry() {
        try {
            await inquirer
                .prompt({
                    type: "confirm",
                    name: "moreEmployee",
                    message: "Add more employees?",
                })
                .then((response) => {
                    if (response.moreEmployee) {
                        this.getInfo();
                    }
                    else {
                        this.exitApp();
                    }
                });
        }
        catch (err) {
            console.log(err);
        }
    }

    async exitApp() {
        try {
            this.outputFile = render(this.employees);

            if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR);
            }

            await writeFile(outputPath, this.outputFile);
            console.log("\n============================================================");
            console.log("\nSuccess => Please check the 'output' folder");
            console.log("\n============================================================");

            process.exit(0);
        }
        catch (err) {
            console.log(err);
        }
    }
}

let myCompany = new Company();
myCompany.getInfo();