const { SlashCommandBuilder } = require('discord.js');

function getByValue(map, searchValue) {
    for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('チャンネル作るよ')
        .addStringOption(option => 
            option
            .setName('channel')
            .setDescription('新しいチャンネル名')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('category')
            .setDescription('既存のカテゴリー名')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('topic')
            .setDescription('チャンネルの説明文')
            .setRequired(false)),

	async execute(interaction) {
        const newChannel = interaction.options.get('channel');
        const category = interaction.options.get('category');
        const topic = interaction.options.get('topic');

        const existedCategory = interaction.guild.channels.cache
            .filter(channel => channel.type === 4); // Guild Category

        const existedCategoryNames = existedCategory
            .map(category => category.name);

        if (!(existedCategoryNames.includes(category.value))) {
            await interaction
                .reply(`そんなカテゴリーないよー\n存在するカテゴリー: ${[...existedCategoryNames]}\n君が言ったカテゴリー: ${category.value}`);
            return;
        }

        const parent = existedCategory.find(channel => channel.name === category.value);
        interaction.guild.channels.create({
            name: newChannel.value,
            topic: topic, 
            parent: parent,
        })
        .then(console.log)
        .catch(console.error);

        await interaction.reply("作成しました！");
	},
};
