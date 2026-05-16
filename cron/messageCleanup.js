const ArchivedMessage = require("../models/archivedMsg");
const User = require("../models/user");
const Message = require("../models/message");
const cron = require("node-cron");
const { Op } = require("sequelize");

//auto run function every 12am
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Cron started...");
    // 1. Get old messages

    const oldMessages = await Message.findAll({
      where: {
        createdAt: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });

    if (oldMessages.length === 0) return;

    // 2. Convert Sequelize objects to plain JSON
    const archivedData = oldMessages.map((msg) => ({
      id: msg.id,
      message: msg.message,
      userId: msg.userId,
      createdAt: msg.createdAt,
    }));
    // 3. Insert into archive table
    await ArchivedMessage.bulkCreate(archivedData);

    // 4. Delete from main table

    await Message.destroy({
      where: {
        createdAt: {
          [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      },
    });
  } catch (err) {
    console.error("Cron error:", err);
  }
});
