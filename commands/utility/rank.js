const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Rank a user to a role'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};