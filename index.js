const venom = require('venom-bot');
const path = require('path');
const cron = require('node-cron');

// 📋 Menu Text
const MENU_TEXT = `🙏 *Welcome to HC SriVenkateswara Swamy Temple WhatsApp Bot - SriVaariBot!*\n\nPlease reply with:
1️⃣ Temple Timings
2️⃣ Archana Timings
3️⃣ Darshan Live
4️⃣ Event Calendar
5️⃣ Donate
7️⃣ Srivari ThiruNakshatra Kalyanam
8️⃣ Srivari Abhishekam Booking
9️⃣ Sri SatyanarayanaSwamy Vratam Booking`;

// 🔔 Daily Bhajan Text
const BHAJAN_TEXT = `🕉️ *Daily Quote*\n\n"Govinda Govinda!"\nMay Lord Venkateswara bless your day 🙏`;

// 🔔 Optional: Subscribed Users (can be dynamic or loaded from DB)
const subscribedUsers = [
  '918179515577@c.us', // Format: countrycode + number + @c.us
  '919121747934@c.us'
];

// 🚀 Launch Bot
venom
  .create({
    session: 'temple-bot',
    multidevice: true,
    browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'],
    puppeteerOptions: {
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    }
  })
  .then((client) => start(client))
  .catch((err) => console.error('❌ Error launching bot:', err));

// 🤖 Main Bot Function
function start(client) {
  // 💬 Handle Incoming Messages
  client.onMessage(async (message) => {
    const msg = message.body.trim().toLowerCase();
    const sender = message.from;

    // 🚫 Ignore groups
    if (message.isGroupMsg) {
      console.log(`🚫 Ignored message from group: ${sender}`);
      return;
    }

    console.log(`📩 Message from ${sender}: ${message.body}`);

    switch (true) {
      // 🙏 Welcome + Logo
      case (msg === 'jai' || msg === '🙏 Hai'):
        const logoPath = path.resolve(__dirname, 'SriVaariBotLogo.png');
        await client.sendImage(sender, logoPath, 'SriVaariBotLogo.png', '🛕 *SriVaariBot*');
        await client.sendText(sender, MENU_TEXT);
        break;

      case (msg === '1' || msg.includes('jai shree ram')):
        await client.sendText(sender, '🙏 Jai Shree Ram! Temple is open daily from 6AM to 9PM.');
        break;

      case (msg === '2' || msg.includes('aarti')):
        await client.sendText(sender, '🕉️ *Archana Timings:*\n- Morning Archana: 6:00 AM\n- Evening Archana: 7:00 PM');
        break;

      case (msg === '3' || msg.includes('darshan')):
        await client.sendText(sender, '📺 Click here for Live Darshan:\nhttps://yourtemplelink.com/live');
        break;

      case (msg === '4' || msg.includes('event') || msg.includes('festival')):
        await client.sendText(sender, '📅 *Upcoming Events:*\n- Ram Navami: April 17\n- Hanuman Jayanti: April 23\n- Bhajan Sandhya: Every Saturday at 6PM');
        break;

      case (msg === '5' || msg.includes('donate')):
        await client.sendText(sender, '🙏 *Support Our Temple*\nClick to donate:\nhttps://yourtemplelink.com/donate');
        break;

      case (msg === '7' || msg.includes('kalyanam')):
        await client.sendText(sender, '💒 *Srivari ThiruNakshatra Kalyanam Booking Link:*\nhttps://hctemple.company.site/products/Sri-Vari-ThiruNakshatra-Kalyanam-p393853824');
        break;

      case (msg === '8' || msg.includes('abhishekam')):
        await client.sendText(sender, '🕉️ *Srivari Abhishekam Booking Link:*\nhttps://hctemple.company.site/products/Sri-Vari-ThiruNakshatra-Kalyanam-p393853824');
        break;

      case (msg === '9' || msg.includes('satyanarayan') || msg.includes('vratam')):
        await client.sendText(sender, '🪔 *Sri SatyanarayanaSwamy Vratam Booking Link:*\nhttps://hctemple.company.site/products/Sri-Rama-Sametha-Satya-Narayana-Swamy-Vratam-p393850634');
        break;

      default:
        await client.sendText(sender, MENU_TEXT);
    }
  });

  // 🕖 Scheduled Bhajan Message (optional)
  cron.schedule('23 * * *', async () => {
    console.log('🔔 Sending daily bhajan message...');
    for (const user of subscribedUsers) {
      try {
        await client.sendText(user, BHAJAN_TEXT);
        console.log(`✅ Bhajan sent to ${user}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${user}`, err);
      }
    }
  });
}
