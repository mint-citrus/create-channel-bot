const { Client, Events, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
try {
	const { token, clientId, guildId } = require('./config.json');
} catch {
	console.error("There was no cofig.json file. Needs token, client id");
	return;
}

const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.command = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if('data' in command && 'execute' in command) {
        client.command.set(command.data.name, command);
    } else {
        console.log(`failed to load commands: ${filePath}`);
    }
}

console.log(client.command);

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;

    console.log(interaction);

    const command = interaction.client.command.get(interaction.commandName);

    if(!command) {
        console.error(`no command matching ${interaction.commandName}`);
        return;
    }

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
})

client.login(token);
