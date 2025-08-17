import { SlashCommandBuilder } from 'discord.js';

export default {
    //set data providing command definition
    data: new SlashCommandBuilder()
        .setName('miau')
        .setDescription('replies with miau'),

    //functionality to run from event handler when thje command is used
    async execute(interaction) {

        await interaction.reply('miau');
    },
};