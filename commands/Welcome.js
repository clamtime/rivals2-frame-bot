module.exports = {
	name: 'Welcome',
	aliases: ['welcome', 'wel'],
	description: 'Introduction to the bot.',
	args: false,
	execute(message, args) {
		message.reply(`Welcome to the Frame Bot!\n\nThis bot is meant to help Smash Ultimate players reference character frame data quickly in the comfort of their own discords.`);
		message.channel.send('\nBot created by: **@RagsWasTaken**, Data was collected with the help of **@D_Greetest** and using **ultimateframedata.com**');
		message.channel.send('To begin, use one of the following commands:\n**!characters:** See a full list of characters\n**!moves:** See the moves a given character can do');
		message.channel.send('**!read:** View the framedata on a specific move\n**!error:** If you encounter an error in the bot, let me know with a form!\n**!help:** View furthur information on any of the other commands\n\nMessage any feedback and fixes to **@RagsWasTaken** on Twitter!');
	},
};