const Employee = require("./Employee");

class Intern extends Employee {
  constructor(nameParam, idParam, emailParam, school) {

    super(nameParam, idParam, emailParam);
    this.school = school;
  }

  getRole() {
    return "Intern";
  }

  getSchool() {
    return this.school;
  }
}

module.exports = Intern;