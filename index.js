require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const {
    postNewBitrixLead,
    updateBitrixLeadComment,
    getBitrixLeadStatus,
} = require("./bitrxController");
const { getHash, updateHash } = require("./hashController");

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

const webAppUrl = "https://c455-92-55-35-48.ngrok-free.app";

const startKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "🗨️ Уточнить наличие товара", callback_data: "product" }],
            [{ text: "🚛 Уточнить статус заказа", callback_data: "order" }],
            [{ text: "🤓 Получить бесплатную консультацию", callback_data: "consultation" }],
            [{ text: "🥳 Оставить отзыв о работе приложения", callback_data: "testimonial" }],
        ],
    },
};

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === "/start") {
        await bot.sendMessage(chatId, "Здравствуйте! Что бы Вы хотели сделать?", startKeyboard);

        await bot.sendMessage(chatId, "Так же не забудьте посетить наш магазин по кнопке ниже!", {
            reply_markup: {
                resize_keyboard: true,
                one_time_keyboard: false,
                keyboard: [[{ text: "В магазин 🚗", web_app: { url: webAppUrl } }]],
            },
        });
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            await bot.sendMessage(
                chatId,
                ` Заказ успешно создан! Наши мененджеры свяжутся с Вами в ближайшее время. Номер Вашего заказа - ${data.bitrixID}`
            );
            const username = msg.from.username;
            updateHash(username, data.bitrixID);
            await bot.sendMessage(chatId, "Что-нибудь еще?", startKeyboard);
        } catch (error) {
            console.error(error);
        }
    }
});

bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (data === "order") {
        try {
            await bot.sendMessage(chatId, "Окей, напишите номер Вашего заказа");
            bot.on("message", async (msg) => {
                // TODO find order status in WC base and send answer to customer
                const apiRes = await getBitrixLeadStatus(+msg.text);
                await bot.sendMessage(chatId, apiRes);
                setTimeout(() => {
                    bot.sendMessage(chatId, "Что-нибудь еще?", startKeyboard);
                }, 700);
                bot.removeListener("message");
            });
        } catch (error) {
            console.error(error);
        }
        return;
    }

    if (data === "product") {
        try {
            await bot.sendMessage(chatId, "Хорошо. Напишите, какой товар Вас интересует");
            bot.on("message", async (msg) => {
                // TODO create a new bitrix lead with COMMENT and chat.username like contact type and chat.name like name
                const postData = {
                    fields: {
                        COMMENTS: `Задал вопрос о товаре: ${msg.text}`,
                        SOURCE_DESCRIPTION: "hilux-tg-bot",
                        TITLE: `${msg.chat.first_name}  Вопрос о товаре`,
                        NAME: msg.chat.first_name,
                        IM: [
                            {
                                TYPE_ID: "telegram",
                                VALUE: `Telegram username: @${msg.chat.username}`,
                            },
                        ],
                    },
                };
                const username = msg.from.username;
                const bitrixID = getHash(username);
                if (bitrixID) {
                    updateBitrixLeadComment(bitrixID, `Задал вопрос о товаре: ${msg.text}`);
                } else {
                    const res = await postNewBitrixLead(postData);
                    updateHash(username, res.result);
                }
                await bot.sendMessage(chatId, "Ваш вопрос доставлен! Подготовим ответ и вернемся!");
                await bot.sendMessage(chatId, "Что-нибудь еще?", startKeyboard);
                bot.removeListener("message");
            });
        } catch (error) {
            console.error(error);
        }
    }

    if (data === "consultation") {
        try {
            await bot.sendMessage(
                chatId,
                "Супер! Напишите, по какому вопросу Вы бы хотели получить консультацию?"
            );
            bot.on("message", async (msg) => {
                // TODO create a new bitrix lead with COMMENT and chat.username like contact type and chat.name like name
                const postData = {
                    fields: {
                        COMMENTS: `Запросил консультацию: ${msg.text}`,
                        SOURCE_DESCRIPTION: "hilux-tg-bot",
                        TITLE: `${msg.chat.first_name}  Консультация`,
                        NAME: msg.chat.first_name,
                        IM: [
                            {
                                TYPE_ID: "telegram",
                                VALUE: `Telegram username: @${msg.chat.username}`,
                            },
                        ],
                    },
                };
                const username = msg.from.username;
                const bitrixID = getHash(username);
                if (bitrixID) {
                    updateBitrixLeadComment(bitrixID, `Запросил консультацию: ${msg.text}`);
                } else {
                    const res = await postNewBitrixLead(postData);
                    updateHash(username, res.result);
                }
                await bot.sendMessage(chatId, "Ваш вопрос доставлен! Подготовим ответ и вернемся!");
                await bot.sendMessage(chatId, "Что-нибудь еще?", startKeyboard);
                bot.removeListener("message");
            });
        } catch (error) {
            console.error(error);
        }
    }

    if (data === "testimonial") {
        try {
            await bot.sendMessage(
                chatId,
                "Оставьте отзыв о работе нашего приложения. Насколько оно удобно? Если Вы столкнулись с  проблемами, пожалуйста, сообщите нам."
            );
            bot.on("message", async (msg) => {
                // TODO create a new bitrix lead with COMMENT and chat.username like contact type and chat.name like name
                const postData = {
                    fields: {
                        COMMENTS: `Оставил отзыв: ${msg.text}`,
                        SOURCE_DESCRIPTION: "hilux-tg-bot",
                        TITLE: `${msg.chat.first_name}  Отзыв`,
                        NAME: msg.chat.first_name,
                        IM: [
                            {
                                TYPE_ID: "telegram",
                                VALUE: `Telegram username: @${msg.chat.username}`,
                            },
                        ],
                    },
                };
                const username = msg.from.username;
                const bitrixID = getHash(username);
                if (bitrixID) {
                    updateBitrixLeadComment(bitrixID, `Оставил отзыв: ${msg.text}`);
                } else {
                    const res = await postNewBitrixLead(postData);
                    updateHash(username, res.result);
                }
                await bot.sendMessage(chatId, "Спасибо за Ваш отзыв!");
                await bot.sendMessage(chatId, "Что-нибудь еще?", startKeyboard);
                bot.removeListener("message");
            });
        } catch (error) {
            console.error(error);
        }
    }
});
