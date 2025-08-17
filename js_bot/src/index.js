/*
"Main" and executable file.
Creates a client, loads commands y events
*/

//import filesystem
import fs from 'node:fs'
import path from 'node:path';
import dotenv from 'dotenv';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//set path to env, config dotenv to read the env 2 folder up
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

//obtain variables from .env
const token = process.env.DISCORD_TOKEN;

//import client and create client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

//collection of commands
client.commands = new Collection();

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
		//console.log(command);
		//set item in collection, key as command name and value as exported module
		if ('data' in command && 'execute' in command){
			client.commands.set(command.data.name, command);
			//console.log(command);
		}
		else{
			console.log(`command ${filePath} missing estructure`);
		}
	}
}

console.log('[commands]', [...client.commands.keys()]);

const eventsPath = path.resolve(__dirname, '../events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.resolve(eventsPath, file);
	//const event = require(filePath);
	const { default: event } = await import(pathToFileURL(filePath).href);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

//login with token
client.login(token);