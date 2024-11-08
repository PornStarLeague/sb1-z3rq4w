const express = require('express');
const { body, validationResult } = require('express-validator');
const { isAdmin } = require('../../middleware/auth');
const firebaseAdmin = require('../../config/firebase-admin');
const router = express.Router();

// Validation middleware
const validateEvent = [
  body('title').trim().notEmpty().withMessage('Event title is required'),
  body('description').trim().notEmpty().withMessage('Event description is required'),
  body('type').isIn(['weekly', 'monthly', 'special']).withMessage('Invalid event type'),
  body('status').isIn(['draft', 'upcoming', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid event status'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  body('prizes').isArray().withMessage('Prizes must be an array'),
  body('prizes.*.rank').isInt({ min: 1 }).withMessage('Prize rank must be a positive integer'),
  body('prizes.*.amount').isFloat({ min: 0 }).withMessage('Prize amount must be non-negative'),
  body('rules.maxEntries').isInt({ min: 1 }).withMessage('Max entries must be a positive integer'),
  body('rules.entryFee').isFloat({ min: 0 }).withMessage('Entry fee must be non-negative'),
  body('moviePool').isArray().withMessage('Movie pool must be an array'),
  body('maxParticipants').isInt({ min: 1 }).withMessage('Max participants must be a positive integer')
];

// Create new event
router.post('/', isAdmin, validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const db = firebaseAdmin.getDb();
    const eventsRef = db.collection('events');

    // Validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    
    if (endDate <= startDate) {
      return res.status(400).json({
        status: 'error',
        message: 'End date must be after start date'
      });
    }

    // Create event
    const eventData = {
      ...req.body,
      currentParticipants: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: req.user.uid
    };

    const docRef = await eventsRef.add(eventData);

    res.status(201).json({
      status: 'success',
      data: {
        id: docRef.id,
        ...eventData
      }
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create event'
    });
  }
});

// Get all events with filtering and pagination
router.get('/', isAdmin, async (req, res) => {
  try {
    const {
      type,
      status,
      page = 1,
      limit = 10,
      sortBy = 'startDate',
      order = 'desc'
    } = req.query;

    const db = firebaseAdmin.getDb();
    let query = db.collection('events');

    // Apply filters
    if (type) query = query.where('type', '==', type);
    if (status) query = query.where('status', '==', status);

    // Apply sorting
    query = query.orderBy(sortBy, order);

    // Apply pagination
    const startAt = (page - 1) * limit;
    query = query.limit(limit).offset(startAt);

    const snapshot = await query.get();
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get total count for pagination
    const totalQuery = db.collection('events');
    if (type) totalQuery.where('type', '==', type);
    if (status) totalQuery.where('status', '==', status);
    const totalSnapshot = await totalQuery.count().get();

    res.json({
      status: 'success',
      data: events,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalSnapshot.data().count,
        pages: Math.ceil(totalSnapshot.data().count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch events'
    });
  }
});

// Get single event
router.get('/:id', isAdmin, async (req, res) => {
  try {
    const db = firebaseAdmin.getDb();
    const eventRef = db.collection('events').doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        id: doc.id,
        ...doc.data()
      }
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch event'
    });
  }
});

// Update event
router.put('/:id', isAdmin, validateEvent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }

    const db = firebaseAdmin.getDb();
    const eventRef = db.collection('events').doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Prevent updating active or completed events
    const currentStatus = doc.data().status;
    if (['active', 'completed'].includes(currentStatus)) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot update ${currentStatus} event`
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await eventRef.update(updateData);

    res.json({
      status: 'success',
      data: {
        id: doc.id,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update event'
    });
  }
});

// Delete event
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const db = firebaseAdmin.getDb();
    const eventRef = db.collection('events').doc(req.params.id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 'error',
        message: 'Event not found'
      });
    }

    // Prevent deleting active or completed events
    const status = doc.data().status;
    if (['active', 'completed'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Cannot delete ${status} event`
      });
    }

    await eventRef.delete();

    res.json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete event'
    });
  }
});

module.exports = router;