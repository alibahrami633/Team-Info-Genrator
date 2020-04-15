const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const render = require("./lib/htmlRenderer");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const clear = require("clear");
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
            console.log("\n==============================");
            await inquirer
                .prompt([
                    {
                        type: "input",
                        name: "role",
                        message: "Enter 'Manager' or 'Engineer' or 'Intern':",
                        validate: function (val) {
                            const input = /[mei]/gi.test(val);
                            if (!input) {
                                return "Enter 'Manager' or 'Engineer' or 'Intern':";
                            }
                            else {
                                return /[mei]/gi.test(val);
                            }
                        },
                    },
                    {
                        type: "input",
                        name: "name",
                        message: "Enter name:",
                        validate: function (val) {
                            if (val.length) {
                                return /[a-z]/gi.test(val);
                            }
                            else {
                                return "Enter a correct name using 'a-z' letters:";
                            }
                        },
                    },
                    {
                        type: "input",
                        name: "email",
                        message: "Enter email:",
                        validate: function (val) {
                            if (val.length) {
                                return validator.validate(val);
                            }
                            else {
                                return "Wrong format, enter a valid email:";
                            }
                        },
                    },
                    {
                        type: "input",
                        name: "id",
                        message: "Enter id:",
                        validate: function (val) {
                            if (val.length) {
                                return /[a-z0-9]/gi.test(val);
                            }
                            else {
                                return "Enter correct ID containing 'a-z' letters and/or '0-9' numbers:";
                            }
                        },
                    },
                ])
                .then((response) => {
                    this.inputtedDetail = response;
                    this.role = response.role.toLowerCase();
                    this.extraDetail();
                });
        }
        catch (err) {
            console.log(err);
        }
    }

    async extraDetail() {
        try {
            if (this.role === "Manager") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "officeNumber",
                        message: "Office Number: ",
                        validate: function (val) {
                            if (val.length) {
                                return /[0-9]/gi.test(val);
                            }
                            else {
                                return "Use numbers for ID: ";
                            }
                        },
                    })
                    .then((response) => {
                        this.manager = new Manager(
                            this.inputtedDetail.name,
                            this.inputtedDetail.id,
                            this.inputtedDetail.email,
                            response.officeNumber
                        );
                        this.employees.push(this.manager);
                    });
            }
            else if (this.role === "Engineer") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "userName",
                        message: "Enter Github username:",
                        validate: function (val) {
                            if (val.length) {
                                return /[a-z1-9]/gi.test(val);
                            }
                            else {
                                return "github Username: ";
                            }
                        },
                    })
                    .then((data) => {
                        const engineer = new Engineer(
                            this.inputtedDetail.name,
                            this.inputtedDetail.id,
                            this.inputtedDetail.email,
                            data.userName
                        );
                        this.employees.push(engineer);
                    });
            }
            else if (this.role === "Intern") {
                await inquirer
                    .prompt({
                        type: "input",
                        name: "schoolName",
                        message: "School Name:",
                        validate: function (val) {
                            if (val.length) {
                                return /[a-z1-9]/gi.test(val);
                            }
                            else {
                                return "School Name: ";
                            }
                        },
                    })
                    .then((data) => {
                        const intern = new Intern(
                            this.inputtedDetail.name,
                            this.inputtedDetail.id,
                            this.inputtedDetail.email,
                            data.schoolName
                        );
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
                        this.exit();
                    }
                });
        }
        catch (err) {
            console.log(err);
        }
    }

    /** Program Exit */
    async exit() {
        try {
            this.outputFile = render(this.employees);

            if (!fs.existsSync(OUTPUT_DIR)) {
                fs.mkdirSync(OUTPUT_DIR);
            }
            else {
                console.log("\nPath already exists");
            }

            await writeFile(outputPath, this.outputFile);
            console.log("\nInput Data Success.");

            process.exit(0);
        }
        catch (err) {
            console.log(err);
        }
    }

    /** Clears the screen */
    clearScreen() {
        clear();
    }
}

const myCompany = new Company();

myCompany.clearScreen();
myCompany.getInfo();