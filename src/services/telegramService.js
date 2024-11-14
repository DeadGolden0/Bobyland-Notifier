const logger = require('../utils/logger');
const { getGenreName } = require('../utils/genreUtils');

/**
 * Sends a message with a movie poster to a Telegram chat.
 *
 * @param {Object} movieDatas - The movie object containing details about the movie.
 * @param {string} movieDatas.poster_path - The path to the movie's poster image.
 * @param {string} text - The text message to send along with the movie poster.
 * @returns {Promise} - A promise that resolves when the message has been sent.
 */
const { Bot } = require('grammy');
const { telegramToken, telegramChatId } = require('../config');

const bot = new Bot(telegramToken);

async function sendMovieMessage(movieDatas) {
    const imageUrl = await getMoviePoster(movieDatas.poster_path);
    const description = await getMovieDesc(movieDatas);
    try {
        await bot.api.sendPhoto(telegramChatId, imageUrl, {
            caption: description,
            parse_mode: 'Markdown'
        });
        logger.success(`🟢 Message envoyé à Telegram pour le film : ${movieDatas.title}`);
    } catch (error) {
        logger.error(`🔴 Erreur lors de l\'envoi du message à Telegram pour le film ${movieDatas.title}:`, error);
    }
}

async function getMoviePoster(path) {
    return `https://image.tmdb.org/t/p/w500${path}`;
}

async function getMovieDesc(movieDatas) {
    const formattedDate = new Date(movieDatas.release_date).toLocaleDateString('fr-FR');
    const text = `
🎬 *Nouveautés sur la TV DE MAITRE BOBY* 🎬

🎥 *Titre:* ${movieDatas.title}
🎥 *Type:* Film
⭐ *Note:* ${movieDatas.vote_average.toFixed(1)}/10
📅 *Date de sortie:* ${formattedDate}
🎞 *Genre:* ${movieDatas.genre_ids.map(id => getGenreName(id)).join(', ')}

🎭 *Synopsis:* 

${movieDatas.overview}

👀 *Ne ratez pas cette occasion de (re)découvrir ce chef-d'oeuvre !* #NouveautéSurPlex
    `;
    return text;
}

module.exports = { sendMovieMessage };
