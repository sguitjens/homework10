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

const askQuestions = (role) => {
  return inquirer.prompt([ // returns answers
    {
      type: "input",
      name: "name",
      message: `Please enter full name for the ${role}:`,
      required: true,
      default: "Super Person"
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
        message: "Please enter your office number:",
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
  fs.readFile(indexHTMLTemplate, "utf8", (err, data) => {
    if(err) {
      return console.log("ERROR in reading file in setUpIndexHTML", err);  
    }
    fs.writeFile(indexHTML, data, 'utf8', (err) => {
      if (err) {
        return console.log("ERROR writing file in setUpIndexHTMP", err);
      }
    });
  });
}

const writeToHTML = (list) => {
  setUpIndexHTML();
  for(let i = 0; i < list.length; ++i) {
    employeeTemplate = mgrTemplate;
    if(list === engineers) {
      employeeTemplate = engTemplate;
    }
    else if (list === interns) {
      employeeTemplate = internTemplate;
    }
    fs.readFile(employeeTemplate, "utf8", (err, data) => {
      if(err) {
        return console.log("ERROR reading mgrTeplate", err);  
      }
      data = data.replace(/EMPL_NAME/g, list[i].name)
      data = data.replace(/EMPL_ID/g, list[i].id);
      data = data.replace(/EMPL_EMAIL/g, list[i].email);
      data = data.replace(/EMPL_OTHER/g, list[i].office);
      fs.readFile(indexHTML, "utf8", (err, contents) =>  {
        if(err) {
          return console,log("ERROR reading index.html", err);
        }
        console.log("contents1:", contents);
        contents = contents.replace(/<!--##CARDS##-->/g, data);
        console.log("contents2:", contents);
        fs.writeFile(indexHTML, contents, "utf8", (err) => {
          return console.log("ERROR writing to index.html", err); // error here null
        })
      });
      // console.log("data", data);
    })
  }
}

askQuestions("manager");
