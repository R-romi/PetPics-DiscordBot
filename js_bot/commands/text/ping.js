import { SlashCommandBuilder } from 'discord.js';

export default {
    //set data providing command definition
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('replies with Pong'),

    //functionality to run from event handler when thje command is used
    async execute(interaction) { 
        await interaction.reply('pong');
    },
};