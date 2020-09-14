const express = require('express');
const monk = require('monk');
const Joi = require('@hapi/joi');

const db = monk(process.env.MONGO_URI);
const crud = db.get('crud');

const schema = Joi.object({
    // Title
    title: Joi.string().trim().required(),
    // Ingredients with quantaties aka description 
    description: Joi.string().trim().required(),
    // Category ex:bf, snacks
    category: Joi.string().trim().required(),
    // Cuisine
    cuisine: Joi.string().trim().required(),
    // Main Ingredient
    main_ingredient: Joi.string().trim().required(),
    // Preparation
    preparation: Joi.string().trim().required(),
    // source - option
    source: Joi.string().trim(),
});

const router = express.Router();

// READ ALL
router.get('/', async (req, res, next) => {
    try{
        const items = await crud.find({});
        res.json(items);
    }
    catch(error){
        next(error);
    }
});

// READ one
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await crud.findOne({
            _id: id,
        });
        if(!item) return next();
        return res.json(item);
    } catch (error) {
        next(error);
    }
});

//create one
router.post('/', async (req, res, next) => {
    try {
        const value = await schema.validateAsync(req.body);
        const inserted = await crud.insert(value);
        res.json(inserted);
    } catch (error) {
        next(error);
    }
});

//update one
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const value = await schema.validateAsync(req.body);
        const item = await crud.findOne({
            _id: id,
        });
        if(!item) return next();
        const updated = await crud.update({
            _id: id,
        }, {
            $set: value,
        });
        res.json(value);
    } catch (error) {
        next(error);
    }
});

//delete one
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await crud.remove({ _id: id });
        res.json({
            message: 'Success',
        });
    } catch (error) {
        next(error);
    }
});
module.exports = router;