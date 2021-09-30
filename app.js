"use strict";

//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(
    "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
    yesNo
  ).toLowerCase();
  let searchResults;
  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      searchResults = singleSearchTrait(people);
      if (searchResults.length === 1) {
        searchResults = searchResults[0];
      } 
      else {
        while (searchResults.length > 1) {
          displayPeople(searchResults);
          searchResults = singleSearchTrait(searchResults);
        }
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
      // TODO: get person's family
      break;
    case "descendants":
      let searchResultsID = person.id;
      displayDecendants(searchResultsID, people);
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
  let trait = promptFor("would you like to search by:\ngender\ndob\nheight\nweight\neyeColor\noccupation", autoValid);
  let input = promptFor("Enter a value:", autoValid);
  let filterArray = people.filter(function (object) {
    if (String(object[trait]) === String(input)) {
      return true;
    }
    else if (Array.isArray(object[trait])) {
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
    }
    else if (Array.isArray(object[trait])) {
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

function descendants(id, people) {
  let children = searchTrait("parents", id, people);
  for (let i = 0; i < children.length; i++) {
    let grandchildren = descendants(children[i].id, people);
    children = [...children, ...grandchildren];
  }
  return children;
}

function displayDecendants(id, people) {
  let allDescendants = descendants(id, people);
  console.log(allDescendants);
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

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += "Gender: " + person.gender + "\n";
  personInfo += "Date of Birth: " + person.dob + "\n";
  personInfo += "Height: " + person.height + "\n";
  personInfo += "Weight: " + person.weight + "\n";
  personInfo += "Eye Color: " + person.eyeColor + "\n";
  personInfo += "Occupation: " + person.occupation + "\n";
  personInfo += "Parents: " + person.parents + "\n";
  personInfo += "Current Spouse: " + person.currentSpouse + "\n";
  alert(personInfo);
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
    var response = prompt(question).trim();
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

function validateTraitNumbers(input) {
  let num = parseInt(input);
  if (num >= 1 || num <= 7) {
    return true;
  } else {
    return false;
  }
}
//#endregion
