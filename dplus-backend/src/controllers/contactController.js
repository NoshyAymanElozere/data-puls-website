import Contact from '../models/Contact.js';

/**
 * @desc    Submit contact form message
 * @route   POST /api/contact
 * @access  Public
 */
export const createContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required fields.',
      });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: newContact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Get all contact messages
 * @route   GET /api/contact
 * @access  Admin/Private
 */
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * @desc    Delete a contact message by ID
 * @route   DELETE /api/contact/:id
 * @access  Admin/Private
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully.',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export default {
  createContact,
  getAllContacts,
  deleteContact,
};
