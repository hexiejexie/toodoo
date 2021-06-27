'use strict';

const mongoose = require("mongoose");
const Populate = require("../util/autopopulate");

let CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "card"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updateAt: Date
});

module.exports = mongoose.model("comments", CommentSchema);
