class Employee {

    /**
     * Creates an instance of an Employee
     * @param {String} name Employee's name
     * @param {Number} id Employee's Id
     * @param {String} email Employee's email address
     */

    constructor(name, id, email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = this.constructor.name; // gets the name of the cunstructor and inherited classes constructors => Employee
    }

    /** Email getter */
    getEmail() {
        return this.email;
    }

    /** Role Getter */
    getRole() {
        return this.role;
    }

    /** ID getter */
    getId() {
        return this.id;
    }

    /** Name Getter */
    getName() {
        return this.name;
    }
}

module.exports = Employee;