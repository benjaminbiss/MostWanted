"use strict";

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region
let dataFiltered;

// app is the function called to start the entire application
function app(people) {
  let message = `
    What type of search do you want to do?
    1: Search by name
    2: Search by single trait
    3: Search by multiple traits
    4: Exit
    `;
  let searchType = promptFor(message, isNumber1To4);
  switch (searchType) {
    case "1":
      dataFiltered = searchByName(people);
      break;
    case "2":
      dataFiltered = searchSingleTrait(people);
      break;
    case "3":
      dataFiltered = searchMultiTrait(people);
    case "4":
      break;
  }
  console.log(dataFiltered);
  if (dataFiltered) {
    generateList(dataFiltered);
  }
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor(
    "Found " +
      person.firstName +
      " " +
      person.lastName +
      " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'",
    autoValid
  );

  switch (displayOption) {
    case "info":
      alert(displayPerson(person));
      break;
    case "family":
      getFamily(person, people);
      break;
    case "descendants":
      let personID = person.id;
      displayDecendants(personID, people);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region
function autoCapFirst(str) {
  const chars = str.split("");
  const c1 = chars[0].toUpperCase();
  const c2 = chars.slice(1);
  for (let i = 0; i < c2.length; i++) {
    c2[i] = c2[i].toLowerCase();
  }
  return c1 + c2.join("");
}

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people) {
  let firstName = autoCapFirst(
    promptFor("What is the person's first name?", autoValid)
  );
  let lastName = autoCapFirst(
    promptFor("What is the person's last name?", autoValid)
  );

  let foundPerson = people.filter(function (potentialMatch) {
    if (
      potentialMatch.firstName === firstName &&
      potentialMatch.lastName === lastName
    ) {
      return true;
    } else {
      return false;
    }
  });
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.

function searchSingleTrait(people) {
  let trait = getSearchTraits(1);
  let value = getTraitValues(trait);
  for (const key in value) {
    trait = key;
  }
  return searchTrait(trait, value[trait], people);
}

function searchTrait(trait, input, people) {
  let filterArray = people.filter(function (object) {
    if (String(object[trait]) === String(input)) {
      return true;
    } else if (Array.isArray(object[trait])) {
      if (object[trait].includes(parseInt(input))) {
        return true;
      }
    } else {
      return false;
    }
  });
  return filterArray;
}

function getSearchTraits(qty) {
  const message = `
  Type the number of the trait you wish to by 
  Type one at a time and press enter:
    1 - Gender
    2 - Date of Birth
    3 - Height
    4 - Weight
    5 - Eye Color
    6 - Occupation
    7 - DONE`;
  let traits = [];
  let input;
  while (input != 7) {
    input = promptFor(message, validateTraitNumbers);
    if (!traits.includes(input) && input != 7) {
      traits.push(input);
    }
    if (qty == 1) {
      input = 7;
    }
  }
  return traits.sort((a, b) => a - b);
}

function getTraitValues(arr) {
  let keys = {
    0: "gender",
    1: "dob",
    2: "height",
    3: "weight",
    4: "eyeColor",
    5: "occupation",
  };
  let values = {};
  for (let i = 0; i < arr.length; i++) {
    const message = `Enter the value for ${keys[arr[i] - 1]}`;
    let value = promptFor(message, autoValid);
    switch (arr[i]) {
      case "1":
        values.gender = value;
        break;
      case "2":
        values.dob = value;
        break;
      case "3":
        values.height = value;
        break;
      case "4":
        values.weight = value;
        break;
      case "5":
        values.eyeColor = value;
        break;
      case "6":
        values.occupation = value;
        break;
      default:
        break;
    }
  }
  return values;
}

function searchMultiTrait(people) {
  let traits = getSearchTraits("x");
  let traitValues = getTraitValues(traits);
  let results = people;
  for (const key in traitValues) {
    results = searchTrait(key, traitValues[key], results);
  }
  return results;
}

function getRelatives(person, people) {
  let allRelatives = {};
  let spouse = searchTrait("currentSpouse", person.id, people)[0];
  if (spouse) {
    allRelatives.currentSpouse = spouse.firstName + " " + spouse.lastName;
  }
  allRelatives.parents = [];
  allRelatives.siblings = [];
  if (person.parents) {
    for (let i = 0; i < person.parents.length; i++) {
      let parent = searchTrait("id", person.parents[i], people)[0];
      allRelatives.parents.push(parent.firstName + " " + parent.lastName);
      let siblings = searchTrait("parents", person.parents[i], people);
      for (let j = 0; j < siblings.length; j++) {
        if (
          !allRelatives.siblings.includes(
            siblings[j].firstName + " " + siblings[j].lastName
          )
        ) {
          allRelatives.siblings.push(
            siblings[j].firstName + " " + siblings[j].lastName
          );
        }
      }
    }
  }
  return allRelatives;
}

function getFamily(person, people) {
  let result = getRelatives(person, people);
  let family = { spouse: "", parents: "", siblings: "" };
  family.spouse = `Spouse: ${result.currentSpouse || "None"}`;
  family.parents = `Parents: ${
    result.parents.length > 0 ? [...result.parents] : "None"
  }`;
  family.siblings = `Siblings: ${
    result.siblings.length > 0 ? [...result.siblings] : "None"
  }`;
  return family;
}

function getDescendants(id, people) {
  let descendants = searchTrait("parents", id, people);
  for (let i = 0; i < descendants.length; i++) {
    let children = getDescendants(descendants[i].id, people);
    descendants = [...descendants, ...children];
  }
  return descendants;
}

function displayDecendants(id, people) {
  let allDescendants = getDescendants(id, people);
  return allDescendants;
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region

// alerts a list of people
function displayPeople(people) {
  alert(
    people
      .map(function (person) {
        return person.firstName + " " + person.lastName;
      })
      .join("\n")
  );
}

function getPersonInfo(person) {
  let personInfo = `First Name: ${person.firstName}
  Last Name: ${person.lastName}
  Gender: ${person.gender}
  Date of Birth: ${person.dob}
  Height: ${person.height}
  Weight: ${person.weight}
  Eye Color: ${person.eyeColor}
  Occupation: ${person.occupation}`;
  return personInfo;
}

//#endregion

//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid) {
  let isValid;
  do {
    var response = prompt(question);
    response = response ? response.trim() : "poop";
    isValid = valid(response);
  } while (response === "" || isValid === false);
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input) {
  if (input.toLowerCase() == "yes" || input.toLowerCase() == "no") {
    return true;
  } else {
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input) {
  return true; // default validation only
}

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input) {}

function isNumber1To4(input) {
  return parseInt(input) <= 4 && parseInt(input) >= 1 ? true : false;
}

function validateTraitNumbers(input) {
  let num = parseInt(input);
  if (num >= 1 && num <= 7) {
    return true;
  } else {
    return false;
  }
}
//#endregion

//HTML Injection.
//Functions to inject HTML based on results
/////////////////////////////////////////////////////////////////
//#region

function generateList(arr) {
  let html = "";
  for (let i = 0; i < arr.length; i++) {
    const person = arr[i];
    let listItem = `<li class="list-group-item"><p>${person.firstName}</p><button onClick="generatePersonData('${person.id}', data)">Show Data</button></li>`;
    html += listItem;
  }
  document.getElementById("people").innerHTML = html;
}

function generatePersonData(id, people) {
  let person = searchTrait("id", id, people)[0];
  let info = getPersonInfo(person);
  let family = getFamily(person, people);
  let descendants = getDescendants(id, people);
  document.getElementById("info").innerText = info;
  document.getElementById(
    "family"
  ).innerText = `${family.parents}, ${family.siblings}, ${family.spouse}`;
  if (descendants.length > 0) {
    var text = "";
    for (const name of descendants) {
      text += `${name.firstName} ${name.lastName}, `
    } 
    text = text.trim();
    text = text.substr(0, text.length - 1);
} else {
  text = 'None'
}
  document.getElementById("descendants").innerText = text;
}


function resetUI() {
  document.getElementById("info").innerText = '';
  document.getElementById("family").innerText = '';
  document.getElementById("descendants").innerText = '';
  document.getElementById("people").innerHTML = "";
}

