const inquirer = require("inquirer");
const fs = require("fs");
const Manager = require("./lib/Manager.js");
const Engineer = require("./lib/Engineer.js");
const Intern = require("./lib/Intern.js");

const managers = [];
const engineers = [];
const interns = [];

const mgrTemplate = "./templates/manager.html";
const engTemplate = "./templates/engineer.html";
const internTemplate = "./templates/intern.html";
const indexHTML = "./output/index.html"
const indexHTMLTemplate = "./templates/indextempl.html";

let pageHTML = "";

const askQuestions = (role) => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: `Please enter full name for the ${role}:`,
      required: true,
      default: `Super ${role}`
    },
    {
      type: "input",
      name: "id",
      message: "Please enter an employee ID:",
      required: true,
      default: "No Employee ID"
    },
    {
      type: "input",
      name: "email",
      message: `Please enter the ${role}'s email address:`,
      required: true,
      default: "No Email Address"
    }
  ])
  .then(answers => {
    if(role === "manager") {
      return inquirer.prompt({
        type: "input",
        name: "office",
        message: "Please enter the manager's office number:",
        required: true,
        default: "No Office"
      })
      .then(result => {
        answers.office = result.office;
        const mgr = new Manager(answers.name, answers.id, answers.email, result.office);
        managers.push(mgr);
        return addAnotherMember();
      })
    }
    else if(role === "engineer") {
      return inquirer.prompt({
          type: "input",
          name: "github",
          message: "Please enter the engineer's GitHub username:",
          required: true,
          default: "No GitHub User Name"
        })
        .then(result => {
          // answers.github = result.github;
          const eng = new Engineer(answers.name, answers.id, answers.email, result.github);
          engineers.push(eng);
          return addAnotherMember();
        })
    }
    else if(role === "intern") {
      return inquirer.prompt({
          type: "input",
          name: "school",
          message: "Please enter the intern's school:",
          required: true,
          default: "No School"
        })
        .then(result => {
          // answers.school = result.school;
          const itn = new Intern(answers.name, answers.id, answers.email, result.school);
          interns.push(itn);
          return addAnotherMember();
        })
    }
  })
}

const addAnotherMember = () => {
  return inquirer.prompt({
    type: "list",
    name: "another",
    message: "Select another team member to add, or select 'Done'",
    choices: ["engineer", "intern", "DONE"],
    required: true,
    default: "Done"
  })
  .then(result => {
    if(result.another === "engineer") {
      askQuestions("engineer");
    }
    else if(result.another === "intern") {
      askQuestions("intern");
    }
    else {
      setUpIndexHTML();
      writeToHTML(managers);
      writeToHTML(engineers);
      writeToHTML(interns);
    }
  })
}

askQuestions.catch = (err) => {
  console.log("ERROR in ask questions:", err);
};

const setUpIndexHTML = () => {
  fs.writeFileSync(indexHTML, fs.readFileSync(indexHTMLTemplate, "utf8"))
}

const writeToHTML = (emplArray) => {
  let employeeTemplate = mgrTemplate;
  const arrLength = emplArray.length;
  if (arrLength == 0) {
    return;
  }
  if(emplArray[0].getRole() == "Engineer") {
    employeeTemplate = engTemplate;
  }
  else if(emplArray[0].getRole() == "Intern") {
    employeeTemplate = internTemplate;
  }
  let emplHTML = fs.readFileSync(employeeTemplate, "utf8");
  for(let i = 0; i < arrLength; ++i) {
    emplHTML = emplHTML.replace(/EMPL_NAME/g, emplArray[i].getName())
    emplHTML = emplHTML.replace(/EMPL_ID/g, emplArray[i].getId());
    emplHTML = emplHTML.replace(/EMPL_EMAIL/g, emplArray[i].getEmail());
    if(emplArray[i].getRole() == "Engineer") {
      emplHTML = emplHTML.replace(/EMPL_OTHER/g, emplArray[i].getGithub());
    }
    else if(emplArray[i].getRole() == "Intern") {
      emplHTML = emplHTML.replace(/EMPL_OTHER/g, emplArray[i].getSchool());
    } else { // manager
      emplHTML = emplHTML.replace(/EMPL_OTHER/g, emplArray[i].getOfficeNumber());
    }
    pageHTML = fs.readFileSync(indexHTML, "utf8")
    pageHTML = pageHTML.replace(/<!--##CARDS##-->/g, emplHTML);
    fs.writeFileSync(indexHTML, pageHTML, "utf8");
    emplHTML = fs.readFileSync(employeeTemplate, "utf8");
  }
};

askQuestions("manager");
