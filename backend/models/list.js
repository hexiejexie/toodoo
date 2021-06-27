const mongoose = require('mongoose')
const {
    Schema
} = mongoose
const Card = require('./Card')

const listSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    // boardId: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'board',
    //     required: true
    // }, //pt mai multe boards
    order: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('list', listSchema)