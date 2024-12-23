module.exports = {
	name: 'Error',
	aliases: ['fix', 'error'],
	description: 'Submit a bug/fix for the bot.',
	args: false,
	execute(message, args) {
		const link = "https://forms.gle/fT3oDuva3DosScjdA"
		message.reply(`Thank you for submitting a fix for the Frame Bot!\nPlease use the following link: ${link}`);
	},
};