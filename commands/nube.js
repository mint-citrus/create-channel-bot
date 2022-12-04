const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nube')
		.setDescription('ぬべって返します'),
	async execute(interaction) {
		await interaction.reply(`ぬべ～`);
	},
};