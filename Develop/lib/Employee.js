class Employee {
  constructor(nameParam, idParam, emailParam) {
    this.name = nameParam;
    this.id = idParam;
    this.email = emailParam;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getRole() {
    return "Employee";
  }
}

module.exports = Employee;
