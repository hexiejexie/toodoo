const { Router } = require('express')
const Board = require('../models/Board')
const Card = require('../models/Card')
const Comment = require('../models/comments')
const { auth } = require('../middleware')
const User = require('../models/User')
const router = Router()

// // fetch all the card entries from db /api/cards
router.get('/', async (req, res, next) => {
    try {
        const cardEntries = await Card.find({ $query: {}, $orderby: { order: 1 } })
        res.json(cardEntries)
    } catch (error) {
        next(error)
    }
});

// create new card entry
router.post('/', auth, async (req, res, next) => {
    try {
        const card = new Card({ ...req.body, userId: req.user })
        const respData = await card.save()
        res.send(respData)
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
});

// create comment for card based on cardId
router.post('/:id/comments', auth, async (req, res, next) => {
    const cardId = req.params.id
    try {
        const cards = await Card.findById(cardId)
        if (!cards)
            return res.status(404).send({ error: 'Card not found!' });
        const comment = new Comment({ ...req.body, userId: req.user, cardId })
        res.send(await comment.save())
    } catch (error) {
        next(error)
    }
});

// create comment for card based on cardId
router.get('/:id/comments', auth, async (req, res, next) => {
    const cardId = req.params.id
    try {
        const cards = await Card.findById(cardId)
        if (!cards)
            return res.status(404).send({ error: 'Card not found!' });
        const comments = await Comment.find({ cardId }).populate({
            path: 'userId',
            select: 'name',
            model: User
        })
        res.send(comments)
    } catch (error) {
        next(error)
    }
});

// get cards based on cardId
router.get('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        const cards = await Card.findById(_id)
        if (!cards)
            return res.status(404).send({ error: 'Card not found!' })
        res.send(cards)
    } catch (error) {
        next(error)
    }
});

// update card content based on id
router.patch('/sortCards', auth, async (req, res, next) => {
    const { fromListId, toListId, fromCardIndex, toCardIndex } = req.body;
    try {
        const fromCards = await Card.find({ listId: fromListId }).sort({ order: 1 });
        if (fromListId === toListId) {
            const cardToMove = fromCards.splice(fromCardIndex, 1)[0];
            fromCards.splice(toCardIndex, 0, cardToMove);
        } else {
            const toCards = await Card.find({ listId: toListId }).sort({ order: 1 });
            const cardToMove = fromCards.splice(fromCardIndex, 1)[0];
            cardToMove.listId = toListId;
            toCards.splice(toCardIndex, 0, cardToMove);
            await Promise.all(toCards.map(async (card, index) => {
                card.order = index;
                await card.save();
            }));
        }
        await Promise.all(fromCards.map(async (card, index) => {
            card.order = index;
            await card.save();
        }));

        res.send({ success: true })
    } catch (error) {
        next(error)
    }
})

// update card content based on id
router.patch('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'description', 'listId', 'order']
    const isValidOperation = updates.every(
        (update) => allowedUpdates.includes(update))
    if (!isValidOperation)
        return res.status(400).send({ error: 'Invalid updates!' })
    try {
        const card = await Card.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!card)
            return res.status(404).send({ error: 'Card not found!' })
        res.send(card)
    } catch (error) {
        next(error)
    }
});

// delete card based on id
router.delete('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        const cardToDelete = await Card.findById(_id);
        if (!cardToDelete)
            return res.status(404).send({ error: 'Card not found!' })
        const listId = cardToDelete.listId;
        cardToDelete.delete();
        const cards = await Card.find({ listId }).sort({ order: 1 });
        await Promise.all(cards.map(async (card, index) => {
            card.order = index;
            await card.save();
        }));
        res.send(cards);
    } catch (error) {
        next(error);
    }
})


module.exports = router

