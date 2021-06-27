const {
    Router
} = require('express')
// const Board = require('../models/Board')  //if i need multiple boards
const List = require('../models/list')
const Card = require('../models/Card')
const {
    auth
} = require('../middleware')
const router = Router()

// // fetch all the list entries from the db
router.get('/', async (req, res, next) => {
    try {
        let listEntries = await List.aggregate([{
                $lookup: {
                    from: "cards",
                    localField: "_id",
                    foreignField: "listId",
                    as: "cards"
                }
            },
            {
                $unwind: {
                    path: "$cards",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "cards.userId",
                    foreignField: "_id",
                    as: "cards.user"
                }
            }, {
                $group: {
                    _id: "$_id",
                    order: {$first: "$order"},
                    name: {
                        $first: "$name"
                    },
                    cards: {
                        $push: "$cards"
                    }
                }
            },
            {
                $sort: {
                    order: 1
                }
            },
        ])
        res.status(200).json(listEntries)
    } catch (error) {
        next(error)
    }
})

// create new entry of list
router.post('/', auth, async (req, res, next) => {
    try {
        // const boardId = req.body.boardId
        // const board = await Board.findOne({ _id: boardId, userId: req.user })
        // if (!board)
        //     return res.status(404).send()    //for multiple boards
        const list = new List(req.body)
        const respData = await list.save()
        res.send(respData)
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
})

// create new entry of list
router.patch('/order', auth, async (req, res, next) => {
    try {
        const {
            fromColumnId,
            toColumnId
        } = req.body;

        try {
            const fromColumn = await List.findById(fromColumnId);
            const toColumn = await List.findById(toColumnId);

            const fromColumnOrder = fromColumn.order;
            fromColumn.order = toColumn.order;
            toColumn.order = fromColumnOrder;

            if (!fromColumn || !toColumn)
                return res.status(404).send({
                    error: 'List not found!'
                })

            await List.updateOne({
                _id: fromColumn._id
            }, fromColumn);

            await List.updateOne({
                _id: toColumn._id
            }, toColumn);

            res.send({
                fromColumn,
                toColumn
            });
        } catch (error) {
            next(error)
        }
        const list = new List(req.body)
        const respData = await list.save()
        res.send(respData)
    } catch (error) {
        if (error.name === 'ValidationError')
            res.status(422)
        next(error)
    }
});


// get list based on listId
router.get('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        const lists = await List.findById(_id)
        if (!lists)
            return res.status(404).send()
        res.send(lists)
    } catch (error) {
        next(error)
    }
})

// fetch cards based on list-id
router.get('/:id/cards', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        const lists = await List.findById(_id)
        if (!lists)
            return res.status(404).send()
        const cards = await Card.find({
            listID: _id
        })
        res.send(cards)
    } catch (error) {
        next(error)
    }
})

// update list content based on id
router.patch('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'order']
    const isValidOperation = updates.every(
        (update) => allowedUpdates.includes(update))
    if (!isValidOperation)
        return res.status(400).send({
            error: 'Invalid updates!'
        })
    try {
        const list = await List.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })
        if (!list)
            return res.status(404).send({
                error: 'List not found!'
            })
        res.send(list)
    } catch (error) {
        next(error)
    }
})

// delete list based on id
router.delete('/:id', auth, async (req, res, next) => {
    const _id = req.params.id
    try {
        const list = await List.findByIdAndDelete(_id)
        if (!list) return res.status(404).send()

        await Card.deleteMany({
            listId: list._id
        })

        res.status(200).send(list)
    } catch (error) {
        next(error)
    }
})

module.exports = router