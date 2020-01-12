const Employee = require("./Employee");

class Engineer extends Employee {
  constructor(nameParam, idParam, emailParam, gitHubUsername) {

    super(nameParam, idParam, emailParam);
    this.github = gitHubUsername;
  }

  getRole() {
    return "Engineer";
  }

  getGithub() {
    return this.github;
  }
}

module.exports = Engineer;