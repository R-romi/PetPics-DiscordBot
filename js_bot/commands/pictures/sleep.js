import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { getImageBufferFromBucket } from '../../lib/services/bucket/supaBaseBuckets.js';
import { fetchByRandomValue } from '../../lib/services/database/supaBaseRequests.js';

export default {
    //set data providing command definition
    data: new SlashCommandBuilder()
        .setName('sleep')
        .setDescription('zzzz'),
    //functionality to run from event handler when thje command is used
    async execute(interaction) {
        await interaction.deferReply();
        const phrase = await fetchByRandomValue('phrase','phrases','type','sleep');
        const file  = await getImageBufferFromBucket('photos','sleep');
        //reply
        const attachment = new AttachmentBuilder(file, { name: 'image.png' });
        await interaction.editReply( {content : phrase,files: [attachment]});
    },
};