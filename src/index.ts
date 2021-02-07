import { Client, VoiceChannel, VoiceConnection } from 'discord.js';
import { config } from 'dotenv';

config();
const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID || '';
const voiceChannelId = process.env.VOICE_CHANNEL_ID || '';

const getVoiceChannel = (client: Client) => {
  return client.guilds
    .cache.get(guildId)?.channels
    .cache.get(voiceChannelId) as VoiceChannel;
};

const playCuckoo = (count: number) => (connection: VoiceConnection) => {
  connection.play('./data/cuckoo.wav').on('finish', () => {
    if (count > 1) {
      playCuckoo(count - 1)(connection);
    } else {
      connection.channel.leave();
    }
  });
};

(async function main() {
  const client = new Client();

  const play = (hour: number) => {
    const strikeTimes = hour === 0 ? 12 :
      (13 <= hour && hour <= 23) ? hour - 12 : hour;

    getVoiceChannel(client)?.join().then(playCuckoo(strikeTimes));
  };

  const handleOnReady = () => {
    let hour = new Date().getHours();

    setInterval(() => {
      const nowHour = new Date().getHours();
      if (hour != nowHour) {
        hour = nowHour;
        play(hour);
      }
    }, 1000);
  };

  client.on('ready', handleOnReady);
  client.login(token);
})();
