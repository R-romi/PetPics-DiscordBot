/* 
Deploy commands, register commands using Discord API
*/
import { REST, Routes } from 'discord.js';

//set path to env, config dotenv to read the env 2 folder up
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const token = process.env.DISCORD_TOKEN;

//collection of commands
const commands = [];
//set path for commands path
const foldersPath = path.resolve(__dirname,'../commands');
const commandFolders = fs.readdirSync(foldersPath);

//create items in collection of commands
for (const folder of commandFolders){	
	//iterate over commands folder
	const commandsPath = path.resolve(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	//files in folder
	for (const file of commandFiles) {
		const filePath = path.resolve(commandsPath, file);
		//const command = require(filePath);
		const { default: command } = await import(pathToFileURL(filePath).href);

		//set item in collection, key as command name and value as exported module
		if ('data' in command && 'execute' in command){
			commands.push(command.data.toJSON());
		}
		else{
			console.log(`command ${filePath} missing estructure`);
		}
	}
}

const rest = new REST().setToken(token);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        //put commands on the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            {
                body: commands
            },
        );
    } catch (error) {
        console.error(error);
    }
})();


console.log('[deploy] registrando:', commands.map(c => c.name));
