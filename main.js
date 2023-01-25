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
    rl.question('Hello, welcome to the contacts app. What would you like to do? view, search, edit, add, remove or search? ', (action) => {
        if(action.toLowerCase() === "view")
        {
            console.log("here is your Contact list: ");
            console.log(sortList(currentContacts));
            run(currentContacts); //throws the user back to the main screen make another action
        }
        else if (action.toLowerCase() === "add")
        {
            rl.question("What is the name of the contact? \n", (name) => { //user input for contact's name
                rl.question("What is the number of the contact? ", (number) => {  // user input for contact's number
                    let contact = name + " - " + number; // adding the name and number with a - in between to a new value called contact
                    currentContacts += contact + "\n"; //adds contact to currentContact list with a new line in between
                    fs.writeFile("contacts.txt", currentContacts, (err) =>{
                        if (err) throw err;
                        console.log("Contact Saved Successfully!");
                        run(currentContacts); //throws the user back to the main screen make another action
                    })
                })
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
