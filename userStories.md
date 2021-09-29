# User Stories

## As a user, I want to be able to search for someone based on a single criterion //COMPLETE

- Solution Steps:
  1. Filter dataset; use criteria to build array for objects that match search criterion
  2. Return array

You should be able to find and return a list of people who match the search

## As a user, I want to be able to search for someone based on multiple traits (up to a maximum of five criteria at once) //COMPLETE

- Solution Steps:
  1. Prompt user to select traits to use; validate
  2. Prompt user to input trait value; validate
  3. Loop dataset, find objects which match all traits
  4. Return list

i.e., if you search for Gender: male and Eye Color: blue, you should get back a list of people who match the search. In this case, it will be only people who are male with blue eyes

## As a user, I want to be able to look up someone’s information after I find them with the program (display values for the various traits of the found person) //NOTSTARTED

- Solution Steps:
  1. Prompt user for ID of found person; validate
  2. Loop dataset, find object by ID
  3. Return object

## As a user, after locating a person, I want to see only that person’s descendants (display the names of the descendants) //NOTSTARTED

- Solution Steps:
  1. Prompt user for ID of found person; validate
  2. Loop dataset, find object(s) which parent property contains ID
  3. Return object(s) first and last names as an array? maybe

## As a user, after locating a person, I want to see only that person’s immediate family members, displaying the names of the family members and their relation to the found person //NOTSTARTED

- Solution Steps:
  1. Prompt user for ID of found person; validate
  2. Loop each id in parents property and find object that matches ID; if none, make orphan
  3. Use cuurrent spouse property to Loop dataset find object that matches ID for spouse; if none, make single
  4. Loop each id in parents property and find any objects which parents property contains one or both of person's parent ids
i.e., parents, spouse, siblings
**Bonus**

## As a user, after locating a person, I want to see only that person’s descendants (display the names of the descendants), using recursion //NOTSTARTED
