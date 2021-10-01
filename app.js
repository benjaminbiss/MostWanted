"use strict";

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region

// app is the function called to start the entire application
function app(people) {
  let message = `
    What type of search do you want to do?
    1: Search by name
    2: Search by single trait
    3: Search by multiple traits
    `;
  let searchType = promptFor(message, isNumber1To3);
  let searchResults;
  switch (searchType) {
    case 1:
      searchResults = searchByName(people);
      break;
    case 2:
      searchResults = singleSearchTrait(people);
      while (searchResults.length > 1) {
        displayPeople(searchResults);
        searchResults = singleSearchTrait(searchResults);
        searchResults = searchResults[0];
      }
      break;
    default:
      app(people); // restart app
      break;
  }
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
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

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

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
  foundPerson = foundPerson[0];
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.

function singleSearchTrait(people) {
  let trait = promptFor(
    "would you like to search by:\ngender\ndob\nheight\nweight\neyeColor\noccupation",
    autoValid
  );
  let input = promptFor("Enter a value:", autoValid);
  let filterArray = people.filter(function (object) {
    if (String(object[trait]) === String(input)) {
      return true;
    } else if (Array.isArray(object[trait])) {
      let numInput = input;
      if (object[trait].includes(numInput)) {
        return true;
      }
    } else {
      return false;
    }
  });
  return filterArray;
}

function searchTrait(trait, input, people) {
  let filterArray = people.filter(function (object) {
    if (String(object[trait]) === String(input)) {
      return true;
    } else if (Array.isArray(object[trait])) {
      if (object[trait].includes(input)) {
        return true;
      }
    } else {
      return false;
    }
  });
  return filterArray;
}

function getSearchTraits() {
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
  let traits = getSearchTraits();
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
  //   alert(spouse + "\n" + parents + "\n" + siblings);
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
  person = person[0];
  let personInfo = `
  First Name: ${person.firstName}
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

function isNumber1To3(input) {
  return input <= 3 && input >= 1 ? true : false;
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
    console.log(person);
    let listItem = `<li class="list-group-item"><p>${person.firstName}</p><button onClick="generatePersonData('${person.id}', data)">Show Data</button></li>`;
    html += listItem;
  }
  document.getElementById("people").innerHTML = html;
}

function generatePersonData(id, people) {
  let person = searchTrait("id", id, people);
  let info = getPersonInfo(person);
  let family = getFamily(person, people);
  let descendants = getDescendants(id, people);
  console.log(info, family, descendants);
}
