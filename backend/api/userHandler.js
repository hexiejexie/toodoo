const {
    Router
} = require('express')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
    auth
} = require('../middleware')
const router = Router()

// register a new user
router.post('/register', async (req, res, next) => {
    const {
        password,
        name,
        email
    } = req.body
    try {
        if (!email || !password || !name) {
            return res.status(400).json({
                msg: 'Enter all fields value'
            })
        }

        const existingUser = await User.findOne({
            email
        })
        if (existingUser)
            return res.status(400).json({
                msg: 'Email already exists'
            })

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)
        const newUser = new User({
            email,
            name,
            password: passwordHash
        })
        const response = await newUser.save()
        res.status(200).send({
            user: response
        })
    } catch (error) {
        if (error.name === 'ValidationError')
            return res.status(422)
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    const {
        email,
        password
    } = req.body
    try {
        if (!email || !password)
            return res.status(400).json({
                msg: 'Enter all fields value'
            })

        const user = await User.findOne({
            email
        })
        if (!user)
            return res.status(400).json({
                msg: 'User doesn\'t exist'
            })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch)
            return res.status(400).json({
                msg: 'Invalid Credentials'
            })

        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET)
        res.json({
            token,
            user: user
        })
    } catch (error) {
        next(error)
    }
})


router.post('/tokenIsValid', async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        next(error)
    }
})

router.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user)
        if (!user)
            return res.status(404).send()
        res.json({
            user,
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router