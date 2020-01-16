const inquirer = require("inquirer");
const fs = require("fs");
// const generate = require("./generateHTML");

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
  return inquirer.prompt([ // returns answers
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
    // console.log("ROLE", role);
    if(role === "manager") {
      // console.log("MANAGER")
      return inquirer.prompt({
        type: "input",
        name: "office",
        message: "Please enter the manager's office number:",
        required: true,
        default: "No Office"
      })
      .then(result => {
        answers.office = result.office;
        // console.log("after manager", answers);
        managers.push(answers);
        return addAnotherMember();
      })
    }
    else if(role === "engineer") {
      // console.log("ENGINEER")
      return inquirer.prompt({
          type: "input",
          name: "github",
          message: "Please enter the engineer's GitHub username:",
          required: true,
          default: "No GitHub User Name"
        })
        .then(result => {
          answers.github = result.github;
          // console.log("RESULT", result);
          // console.log("ANSWERS after engineer", answers);
          // put it in the engineer array
          engineers.push(answers);
          return addAnotherMember();
        })
    }
    else if(role === "intern") {
      // console.log("INTERN")
      return inquirer.prompt({
          type: "input",
          name: "school",
          message: "Please enter the intern's school:",
          required: true,
          default: "No School"
        })
        .then(result => {
          answers.school = result.school;
          // console.log("after intern", answers);
          //put it in the intern array
          interns.push(answers);
          addAnotherMember();
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
  .then(result => { // what the user selected
    // console.log("RESULT", result);
    if(result.another === "engineer") {
      askQuestions("engineer");
    }
    else if(result.another === "intern") {
      askQuestions("intern");
    }
    else {
      // console.log("MANAGERS", managers);
      // console.log("ENGINEERS", engineers);
      // console.log("INTERNS", interns);
      // make the page
      // console.log("SET UP INDEX.HTML PAGE");
      setUpIndexHTML();
      // console.log("RUN MANAGERS:");
      writeToHTML(managers);
      // console.log("RUN ENGINEERS");
      writeToHTML(engineers);
      // console.log("RUN INTERNS");
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
  // setUpIndexHTML();
  // let result = "";
  let employeeTemplate = mgrTemplate;
  let other = "office";
  if(emplArray === engineers) {
    employeeTemplate = engTemplate;
    other = "github";
  }
  else if (emplArray === interns) {
    employeeTemplate = internTemplate;
    other = "school";
  }
  let emplHTML = fs.readFileSync(employeeTemplate, "utf8");
  for(let i = 0; i < emplArray.length; ++i) {
    console.log(`emplHTML BEFORE ${i}:`, emplHTML);
    emplHTML = emplHTML.replace(/EMPL_NAME/g, emplArray[i].name)
    emplHTML = emplHTML.replace(/EMPL_ID/g, emplArray[i].id);
    emplHTML = emplHTML.replace(/EMPL_EMAIL/g, emplArray[i].email);
    emplHTML = emplHTML.replace(/EMPL_OTHER/g, emplArray[i][other]);
    pageHTML = fs.readFileSync(indexHTML, "utf8")
    pageHTML = pageHTML.replace(/<!--##CARDS##-->/g, emplHTML);
    fs.writeFileSync(indexHTML, pageHTML, "utf8");
    emplHTML = fs.readFileSync(employeeTemplate, "utf8");
  }
};

askQuestions("manager");
