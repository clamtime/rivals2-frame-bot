module.exports = {
	name: 'Moves',
	aliases: ['moves', 'moveset', 'move'],
	description: 'Character Names.',
	args: false,
	execute(message, args, char, moves) {
		var newStr = `\`\`\`~~~~~~~~~~~${char} Options~~~~~~~~~~~\n`;
		for(const c of moves){
			newStr = newStr.concat(c + "\n");
		}
		newStr += "\`\`\`";
		message.author.send(newStr, {split: true})
	},
};