const {prefix} = require('../config.json');

module.exports = {
	name: 'help',
		description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args){
		const hStr = "Heres a tutorial. It will always go:\n!read [Character Name]_[Character Modifier] [Move Name]_[Move Modifier]\n\nExample:  !read Link UpB_Aerial\n\nCapitalization doesn't matter\n\nCharacter modifiers can be stuff like shulks monados, joker's arsene, cloud's limit, etc.\n\nMove modifiers are stuff like Aerial, Grounded, just stuff that isn't in the default move.";
		
		const hStr2 = "Extra Commands: \n!characters: sends you a list of characters\n!moves [Character Name] sends you a list of that characters moves.\n\nIf a name or anything has a space, just remove it (e.g. King K Rool = kingkrool, F Smash = fsmash, etc.)"
		
		message.author.send(hStr, {split: true})
		message.author.send(hStr2, {split: true})

	}
}