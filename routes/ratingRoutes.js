const express = require('express');
const router = express.Router();
const CustomerRating = require('../models/CustomerRating');

router.post('/', async (req, res) => {
  try {
    const rating = await CustomerRating.create(req.body);
    res.status(201).json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const ratings = await CustomerRating.find().sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const rating = await CustomerRating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }
    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const rating = await CustomerRating.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }
    res.status(200).json({
      success: true,
      data: rating
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const rating = await CustomerRating.findByIdAndDelete(req.params.id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        error: 'Rating not found'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
