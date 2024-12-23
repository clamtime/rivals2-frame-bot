module.exports = {
	name: 'Characters',
	aliases: ['characters', 'chars', 'names', 'character', 'char'],
	description: 'Character Names.',
	args: false,
	execute(message, args, chars) {
		var newStr = "\`\`\`~~~~~~~~~~~Character Options~~~~~~~~~~~\n";
		for(const c of chars){
			newStr = newStr.concat(c + "\n");
		}
		newStr += "\`\`\`";
		message.author.send(newStr, {split: true})
	},
};