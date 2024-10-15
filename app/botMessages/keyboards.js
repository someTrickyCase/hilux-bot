require("dotenv").config();

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

const startInlineKeyboard = {
    reply_markup: {
        resize_keyboard: true,
        one_time_keyboard: false,
        keyboard: [[{ text: "В магазин 🚗", web_app: { url: process.env.WEB_APP_URL } }]],
    },
};

module.exports = { startKeyboard, startInlineKeyboard };
