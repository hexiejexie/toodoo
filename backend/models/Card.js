const mongoose = require('mongoose');
const { Schema } = mongoose;
const Populate = require("../util/autopopulate");

const cardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        listId: {
            type: Schema.Types.ObjectId,
            ref: 'list',
            required: true
        },
        // boardId: {
        //     type: Schema.Types.ObjectId,
        //     ref: 'board',
        //     required: true
        // }, //pt mai multe boards
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        order: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('card', cardSchema)
