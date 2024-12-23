const fs = require('fs');
// require the discord.js module
const Discord = require('discord.js');
const process = require('process');

//calls config file 
const loginData = { prefix, token } = require('./config.json');
loginData.token = process.argv[2];
console.log(loginData.token);

const data = require('./Rivals2FrameData.json');
const { parse } = require('dotenv');
const chars = Object.keys(data);

console.log("arg: %s val: %s", process.argv[2], process.argv[3]);

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.info = new Discord.Collection();

console.log(chars);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const char of Object.keys(data)) {
    client.info.set(char, data[char]);
}


// takes all of the command files and puts them in a collection
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity('BETA Vibes', { type: "PLAYING" })
});

client.on('message', message => {
    console.log(message);
    //exits if message isn't from a bot or doesn't have the nec. prefix
    if (!message.content.startsWith(loginData.prefix) || message.author.bot) return;

    //takes the string that is read and cuts off the first word (the actual command) and then creates an array with the arguements

    //const args = message.content.slice(prefix.length).split(/ +/);
    let args = message.content.slice(loginData.prefix.length).split(/ +/); // changed args to not be a constant, hope this is ok -clem


    //takes the first word that was cut off and lower cases it
    const commandName = args.shift().toLowerCase();

    //checks to see if command exists as a file name or if command is an alias
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includesCaseInsensitive(commandName));

    //if not a command, exit
    if (!command) return;

    //checks to see if command and commnad scipt have arguements
    if (command.args && !args.length) {
        //tells the user the arguements were incorrect
        let reply = `You didn't provide any arguments, ${message.author}!`;

        //if the command script has a usage section, tell the user the usage
        if (command.usage) {
            reply += `\nThe proper usage would be \`${loginData.prefix}${command.name} ${command.usage}\``;
        }

        //exit and send that message
        return message.channel.send(reply);
    }

    if (commandName == "read" || commandName == "readnames" || commandName == "readname" || commandName == "data") {
        name = args[0].toLowerCase();
        move = args[1].toLowerCase();

        args = translateInput(name, move);
        name = args[0].toLowerCase();;
        move = args[1].toLowerCase();;

        console.log(args);

        if (!chars.includesCaseInsensitive(name)) {
            return message.channel.send("This name doesn't exist. Try again or type !help for more information. You can also type !characters to see a list of all of the character names.");
        }
        if (!Object.keys(data[name]).includesCaseInsensitive(move)) {
            return message.channel.send("This move doesn't exist. Try again or type !help for more information. You can also type !Moves[Character Name] to see the list of available moves.");
        }
        command.execute(message, args, name, move, getNestedCaseInsensitive(data, [name, move]));
    }
    else if (commandName == "characters" || commandName == "character" || commandName == "chars" || commandName == "char" || commandName == "names") {
        command.execute(message, args, chars);
    }
    else if (commandName == "moves" || commandName == "move" || commandName == "moveset") {
        name = args[0].toLowerCase()
        command.execute(message, args, name, Object.keys(data[name]));
    }
    else {
        //execute command functionality else log an error
        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying ot execute that command');
        }
    }
});

// login to Discord with your app's token
client.login(loginData.token);


// clem input translator
function translateInput(nameArg, moveArg) {

    // temporary arguments in case input cannot be translated, original data is returned for error handling 
    // translation data assumes lowercase
    let tmpNameArg = nameArg.toLowerCase();;
    let tmpMoveArg = moveArg.toLowerCase();;

    // files containing desired and alternate move and character names
    // line numbers are consistent and relative (e.g. "zerosuitsamus" on line 85 for "desired" and "zss" on line 85 for "alternate")
    const desiredNamesFile = fs.readFileSync("character_names_desired.data", { encoding: 'utf8', flag: 'r' }).split("\n");
    const alternateNamesFile = fs.readFileSync("character_names_alternate.data", { encoding: 'utf8', flag: 'r' }).split("\n");
    const desiredMovesFile = fs.readFileSync("move_names_desired.data", { encoding: 'utf8', flag: 'r' }).split("\n");
    const alternateMovesFile = fs.readFileSync("move_names_alternate.data", { encoding: 'utf8', flag: 'r' }).split("\n");


    // for each token (name, move) search to see if it can be found in given file 
    // such as character names, move names, etc and replace it with desired token if necessary 
    // (e.g. "zss" becomes "zerosuitsamus")
    let characterTokenFound = false;
    let moveTokenFound = false;

    // check if name is already in desired format
    for (let i = 0; i < desiredNamesFile.length && !characterTokenFound; i++) {
        if (tmpNameArg == desiredNamesFile[i].replace(/\r?\n/g, "")) { // compare name with current desired name line ignoring newline character
            characterTokenFound = true;
        }
    }
    // if name is not in desired format, check for alternate names and convert if found
    if (!characterTokenFound) {
        for (let i = 0; i < alternateNamesFile.length && !characterTokenFound; i++) {
            let splitLine = alternateNamesFile[i].replace(/\r?\n/g, "").split("-"); // dash is separator token for alternate names (format: dedede-d3-ddd)
            if (splitLine.includesCaseInsensitive(tmpNameArg)) {
                tmpNameArg = desiredNamesFile[i].replace(/\r?\n/g, ""); // if the current line contains the alternate name provided
                characterTokenFound = true;                             // set nameArg to current line of alternate names file in desired names file
            }
        }
    }

    // check if move is already in desired format
    for (let i = 0; i < desiredMovesFile.length && !moveTokenFound; i++) {
        if (tmpMoveArg == desiredMovesFile[i].replace(/\r?\n/g, "")) {// compare move with current desired move line ignoring newline character
            moveTokenFound = true;
        }
    }

    // if move is not in desired format, check for alternate moves and convert if found
    if (!moveTokenFound) {
        for (let i = 0; i < alternateMovesFile.length && !moveTokenFound; i++) {
            let splitLine = alternateMovesFile[i].replace(/\r?\n/g, "").split("-"); // dash is separator token for alternate moves (format: downair-downaerial-downwardair-downwardaerial)
            if (splitLine.includesCaseInsensitive(tmpMoveArg)) {
                tmpMoveArg = desiredMovesFile[i].replace(/\r?\n/g, ""); // if the current line contains the alternate move provided
                moveTokenFound = true;                                 // set moveArg to current line of alternate moves file in desired moves file
            }
        }
    }

    tmpNameArg = tmpNameArg.replace(/(\r\n|\n|\r)/gm, ""); // ensure new line characters
    tmpMoveArg = tmpMoveArg.replace(/(\r\n|\n|\r)/gm, ""); // are removed from strings

    if (characterTokenFound && moveTokenFound) // aliases used for both name and move, return parsed for both
        return [tmpNameArg, tmpMoveArg];
    else if (characterTokenFound && !moveTokenFound) // alias used only for name, move was ok
        return [tmpNameArg, moveArg];
    else if (!characterTokenFound && moveTokenFound) // alias used only for move, name was ok
        return ([nameArg, tmpMoveArg]);
    else if (!characterTokenFound && !moveTokenFound) // alias used for neither, both were ok
        return ([nameArg, moveArg]);
}

Array.prototype.includesCaseInsensitive = function (value) {
    return this.some(item =>
        typeof item === "string" &&
        item.toLowerCase() === value.toLowerCase()
    );
};

function getCaseInsensitive(obj, key) {
    if (!obj || typeof obj !== "object") return undefined;
    const normalizedKey = Object.keys(obj).find(
        k => k.toLowerCase() === key.toLowerCase()
    );
    return normalizedKey ? obj[normalizedKey] : undefined;
}

function getNestedCaseInsensitive(obj, keys) {
    let current = obj;
    for (const key of keys) {
        current = getCaseInsensitive(current, key);
        if (current === undefined) return undefined; // Key not found
    }
    return current;
}
