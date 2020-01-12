const Employee = require("./Employee");

class Manager extends Employee {
  constructor(nameParam, idParam, emailParam, officeNumber) {

    super(nameParam, idParam, emailParam);
    this.officeNumber = officeNumber;
  }

  getRole() {
    return "Manager";
  }

  getOfficeNumber() {
    return this.officeNumber;
  }
}

module.exports = Manager;