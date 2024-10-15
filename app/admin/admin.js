const DefaultDictionary = {
    onStartMessage: "Здравствуйте! Что бы Вы хотели сделать?",
    repeatableStartMessage: "Что-нибудь еще?",
    ctaMessage: "Так же не забудьте посетить наш магазин по кнопке ниже!",
    orderWelcomeMessage: "Окей, напишите номер Вашего заказа",
    orderConfirmMessage:
        "Заказ успешно создан! Наши мененджеры свяжутся с Вами в ближайшее время. Номер Вашего заказа -",
    testimonialWelcomeMessage:
        "Оставьте отзыв о работе нашего приложения. Насколько оно удобно? Если Вы столкнулись с  проблемами, пожалуйста, сообщите нам.",
    testimonialConfirmMessage: "Спасибо за Ваш отзыв!",
    consultationWelcomeMessage:
        "Супер! Напишите, по какому вопросу Вы бы хотели получить консультацию?",
    consultationConfirmMessage: "Ваш вопрос доставлен! Подготовим ответ и вернемся!",
    productWelcomeMessage: "Хорошо. Напишите, какой товар Вас интересует",
    productConfirmMessage: "Ваш вопрос доставлен! Подготовим ответ и вернемся!",
};

require("dotenv").config();
const { DICTIONARY } = require("../config/dictionary");

const buttons = [];

for (const key in DICTIONARY) {
    buttons.push([{ text: key, callback_data: `${key}` }]);
}

const adminKeyboard = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: true,
        inline_keyboard: buttons,
    },
};

async function botOnAdmin(chatID) {
    try {
        this.removeListener("message");
        await this.sendMessage(chatID, "Коммандовать парадом буду я!");
        this.on("message", async (msg) => {
            if (msg.text === process.env.ADMIN_PASSWORD) {
                await this.sendMessage(chatID, "Я дам вам парабеллум", adminKeyboard);
                this.on("callback_query", async (query) => {
                    this.sendMessage(
                        chatID,
                        `Сейчас в этом экшене текст: ${
                            DICTIONARY[query.data]
                        } Ниже введите новый текст, либо напишите "Назад" для отмены редактирования`
                    );
                    this.on("message", async (msg) => {
                        const text = msg.text;
                        if (text === "Назад") {
                            this.removeListener("message");
                            return;
                        }
                        DICTIONARY[query.data] = text;
                        this.sendMessage(chatID, "Успешно изменено!");
                        this.removeListener("message");
                    });
                });
                this.removeListener("message");
                return;
            } else {
                await this.sendMessage(chatID, "Неверный пароль");
                return;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = { botOnAdmin };
