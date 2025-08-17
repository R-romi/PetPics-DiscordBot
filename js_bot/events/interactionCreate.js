/*
Logic of the bot identifing a command an executing it 
 */

import { Events } from 'discord.js';

//create a listener to respond TO ONLY commands (no other server messages)
export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
	//not an interaction, then return
        if (!interaction.isChatInputCommand()) return;
        //get command
        const command = interaction.client.commands.get(interaction.commandName);
        //unexistent command ERROR
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found :()`);
            return;
        }
        //execute command
        try{
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            /* if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
            } */
            const errorReply = {
                content: 'There was an error while executing this command!',
                ephemeral: true, // <-- esto reemplaza flags: MessageFlags.Ephemeral
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorReply);
            } else {
                await interaction.reply(errorReply);
            }
        }
    },
};