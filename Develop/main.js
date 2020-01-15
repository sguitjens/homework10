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

// const writeToHTML = (array) => {
//   setUpIndexHTML();
//   let result = getListFromArray(array)

// }

// const getListFromArray = (array) => {
//   // setUpIndexHTML();
//   let result = "";
//   let employeeTemplate = mgrTemplate;
//   let other = "office";
//   if(array === engineers) {
//     employeeTemplate = engTemplate;
//     other = "github";
//   }
//   else if (array === interns) {
//     employeeTemplate = internTemplate;
//     other = "school";
//   }
//   for(let i = 0; i < array.length; ++i) {
//     return new Promise((resolve, reject) => {
//       fs.readFile(employeeTemplate, "utf8", (err, data) => {
//         if(err) {
//           return console.log(`ERROR reading ${employeeTeplate}`, err);  
//         }
//         data = data.replace(/EMPL_NAME/g, array[i].name)
//         data = data.replace(/EMPL_ID/g, array[i].id);
//         data = data.replace(/EMPL_EMAIL/g, array[i].email);
//         data = data.replace(/EMPL_OTHER/g, array[i][other]);

//         result += data;
//         resolve(result += data);
//       })
//     }).then(res => {
//       console.log("RES", res);
//       result += res;
//       return result;
//     });
//   }
// }



// THE OLD FUNCTION - which at least wrote 
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
  for(let i = 0; i < emplArray.length; ++i) {
    fs.readFile(employeeTemplate, "utf8", (err, data) => {
      if(err) {
        return console.log(`ERROR reading ${employeeTeplate}`, err);  
      }
      data = data.replace(/EMPL_NAME/g, emplArray[i].name)
      data = data.replace(/EMPL_ID/g, emplArray[i].id);
      data = data.replace(/EMPL_EMAIL/g, emplArray[i].email);
      data = data.replace(/EMPL_OTHER/g, emplArray[i][other]); // this needs to change
      fs.readFile(indexHTML, "utf8", (err, contents) =>  {
        if(err) {
          return console,log("ERROR reading index.html", err);
        }
        // console.log("contents1:", contents);
        contents = contents.replace(/<!--##CARDS##-->/g, data);
        // console.log("contents2:", contents);
        // for loop should happen within the writefile method
        fs.writeFile(indexHTML, contents, "utf8", (err) => {
          if(err) {
            return console.log("ERROR writing to index.html", err); // error here null
          }
          console.log("NO ERROR!")
        })
        //
      });
      // console.log("data", data);
    })
  }
}
// THE OLD FUNCTION

askQuestions("manager");
