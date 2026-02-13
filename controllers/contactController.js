
const Message = require('../models/Message');

const submitMessage = async (req, res) => {
  try {
    const {first_name, last_name, subject,phone, message } = req.body;
    const newMessage = new Message({ first_name, last_name, subject, phone, message });
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages); // ✅ تأكد أنها مصفوفة
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { submitMessage , getMessages , deleteMessage };