#!/usr/bin/env node
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const readline = require('readline');
const fs = require('fs');
const { update } = require('lodash');


console.log(argv);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  fs.readFile("contacts.txt", (err , currentContacts) => { //checks if contacts.txt file exists, if not, it will create a new file.
    if (err) {
        console.log("no file was found! creating todolist.txt");
        fs.writeFile("contacts.txt" , "" , (err) => {
            if (err) throw err;
            run("");
            rl.close();
        })
    }
    else{
        run(currentContacts.toString());
    }
});

function run(currentContacts)
{
    rl.question('Hello, welcome to the contacts app. What would you like to do? view, search, edit, edit number, add, remove? ', (action) => {
        if(action.toLowerCase() === "view")
        {
            console.log("here is your Contact list: ");
            console.log(sortList(currentContacts));
            run(currentContacts); //throws the user back to the main screen make another action
        }
        else if (action.toLowerCase() === "add")
        {
            rl.question("What is the name of the contact? \n", (newName) => { //user input for contact's name
                const contactList=currentContacts.toString().split("\n");
                const existingContact = contactList.find(contact => contact.startsWith(newName));
                if(existingContact)
                {
                   console.log("the name you have entered already exists, try again...");
                   run(currentContacts);
                } 
                else
                {
                    rl.question("What is the number of the contact? ", (number) => {  // user input for contact's number
                        if(number.length === 10)
                        {
                            let contact = newName + " - " + number; // adding the name and number with a - in between to a new value called contact
                            currentContacts += contact + "\n"; //adds contact to currentContact list with a new line in between
                            fs.writeFile("contacts.txt", currentContacts, (err) =>{
                                if (err) throw err;
                                console.log("Contact Saved Successfully!");
                                run(currentContacts); //throws the user back to the main screen make another action
                            })
                        }
                        else
                        {
                            console.log("Invalid Number! should be 10 digits!")
                            run(currentContacts); //throws the user back to the main screen make another action
                        }
                    })
                }
            })
        }
        else if(action.toLowerCase() === "remove")
        {
            rl.question("What is the name of the contact you would like to remove? \n", (nameToRemove) => {
                const contactList = currentContacts.toString().split("\n"); // splits list into Array
                const newContactList = contactList.filter(contact => !contact.startsWith(nameToRemove)); // filters out the index starting with contact name
                const newContacts = newContactList.join("\n"); // joins array back to list of strings
                fs.writeFile("contacts.txt", newContacts, (err) => {
                    if (err) throw err;
                    rl.close();
                })
            })
        }
        else if(action.toLowerCase() === "edit")
        {
            rl.question("What is the name of the contact you would like to edit? \n", (nameToEdit) => {
                rl.question("what would you like to change contacts name to? \n", (newName) => {
                    const updatedContacts = currentContacts.toString().replace(nameToEdit, newName);
                    fs.writeFile("contacts.txt", updatedContacts, (err) => {
                        if (err) throw err;
                        console.log("this contact has been updated successfully! \n");
                        currentContacts = updatedContacts;
                        run(currentContacts);
                    })
                })
            })
        }
        else if(action.toLowerCase() === "edit number")
        {
            rl.question("Which contact's number would you like to edit? \n", (nameToFind) => {
                const contactList = currentContacts.split("\n"); // splits to array
                let contactIndex = contactList.findIndex(contact => contact.startsWith(nameToFind)); //find the index in the array of the contnact by nameToFind
                if(contactIndex === -1) { //checks if the conntact doesnt exist, send back to main screen for reattempt
                    console.log("the contact you are trying to edit does not exist!");
                    run(currentContacts);
                } 
                else 
                {
                    rl.question("what is the new number for " + nameToFind + "? ", (newNumber) => { // if does exist, ask for new number
                        if(newNumber.length === 10)
                        {
                          contactList[contactIndex] = nameToFind + " - " + newNumber; // edits contact info in the contact list
                          currentContacts = contactList.join("\n"); // joins array bacvk to string list
                           fs.writeFile("contacts.txt", currentContacts, (err) => { 
                             if (err) throw err;
                               console.log("this contact has been updated successfully! \n");
                            });
                        }
                        if(newNumber.length != 10)
                        {
                            console.log("Invalid Number! should be 10 digits!")
                        }
                        run(currentContacts); //send back to main
                    });
                }
            });
        } 
        else if(action.toLowerCase() === "search")
        {
            rl.question("Which Contact's information would you like to see? \n", (nameToFind) => {
                const contactList = currentContacts.split("\n");
                const contact = contactList.find(contact => contact.startsWith(nameToFind));
                console.log(contact);
                run(currentContacts);
            })
        }
        else{
            console.log("Invalid Answer, Please Try Again... \n");
            run(currentContacts);
        }
    });
}


function sortList(list)
{
    return list.toString().split("\n") // splits the list into a array by space
    .sort()
    .join("\n");
}
