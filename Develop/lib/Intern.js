const Employee = require("./Employee");

class Intern extends Employee {

    /**
     * @param {String} name Name
     * @param {Number} id ID
     * @param {String} email Email Address
     * @param {String} school School
     */
    constructor(name, id, email, school) {
        super(name, id, email);
        this.school = school;
    }

    /** School Getter */
    getSchool() {
        return this.school;
    }
}

module.exports = Intern;