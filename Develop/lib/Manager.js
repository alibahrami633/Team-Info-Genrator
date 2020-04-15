const Employee = require("./Employee");

class Manager extends Employee {
    /**
     * @param {String} name Name
     * @param {Number} id ID
     * @param {String} email Email Address
     * @param {Number} officeNumber Office Number
     */
    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    /** Office Number Getter */
    getOfficeNumber() {
        return this.officeNumber;
    }
}

module.exports = Manager;