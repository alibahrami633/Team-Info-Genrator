const Employee = require("./Employee");

/** This class represents an Engineer */
class Engineer extends Employee {

    /**
     * @param {String} name name
     * @param {Number} id ID
     * @param {String} email Email Address
     * @param {String} github Github ID
     */
    constructor(name, id, email, github) {
        super(name, id, email);
        this.github = github;
    }

    /** Github ID Getter */
    getGithub() {
        return this.github;
    }
}

module.exports = Engineer;