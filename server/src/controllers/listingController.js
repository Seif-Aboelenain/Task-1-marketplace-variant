import { Listing } from '../models/Listing.js';
import Joi from 'joi';


// ========================
// VALIDATION
// ========================

const createListingSchema = Joi.object({
  title: Joi.string().required(),

  description: Joi.string(),

  price: Joi.number().min(0).required(),

  category: Joi.string().valid(
    'textbooks',
    'electronics',
    'furniture',
    'clothing',
    'other'
  ),

  condition: Joi.string().valid(
    'new',
    'like-new',
    'used',
    'worn'
  ),

  status: Joi.string().valid(
    'active',
    'sold',
    'removed'
  ),

  seller: Joi.string()
});


const updateListingSchema = Joi.object({
  title: Joi.string(),

  description: Joi.string(),

  price: Joi.number().min(0),

  category: Joi.string().valid(
    'textbooks',
    'electronics',
    'furniture',
    'clothing',
    'other'
  ),

  condition: Joi.string().valid(
    'new',
    'like-new',
    'used',
    'worn'
  ),

  status: Joi.string().valid(
    'active',
    'sold',
    'removed'
  ),

  seller: Joi.string()
});


// ========================
// GET ALL LISTINGS
// GET /api/listings
// ========================

export async function getAllListings(req, res, next) {
  try {
    let filter = {};

    // By default, don't show removed listings
    if (req.query.includeRemoved !== 'true') {
      filter.status = { $ne: 'removed' };
    }

    const listings = await Listing.find(filter)
  .populate('seller', 'name email');

    res.status(200).json(listings);

  } catch (err) {
    next(err);
  }
}


// ========================
// GET ONE LISTING
// GET /api/listings/:id
// ========================

export async function getListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id)
  .populate('seller', 'name email');

    if (!listing || listing.status === 'removed') {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);

  } catch (err) {
    next(err);
  }
}


// ========================
// CREATE LISTING
// POST /api/listings
// ========================

export async function createListing(req, res, next) {
  try {
    const { error, value } = createListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const listing = await Listing.create(value);

    res.status(201).json(listing);

  } catch (err) {
    next(err);
  }
}


// ========================
// UPDATE LISTING
// PATCH /api/listings/:id
// ========================

export async function updateListing(req, res, next) {
  try {
    const { error, value } = updateListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.message
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true,
        runValidators: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);

  } catch (err) {
    next(err);
  }
}


// ========================
// SOFT DELETE LISTING
// DELETE /api/listings/:id
// ========================

export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'removed' },
      {
        new: true,
        runValidators: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json({
      message: 'Listing removed successfully',
      listing: listing
    });

  } catch (err) {
    next(err);
  }

}

export async function markAsSold(req, res, next) {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { status: 'sold' },
      {
        new: true,
        runValidators: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);

  } catch (err) {
    next(err);
  }
}