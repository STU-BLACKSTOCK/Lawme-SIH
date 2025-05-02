const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseName: String,
    caseDescription: String,
    caseStatus: String, // 'pending' or 'solved'
    caseFile: String,
    caseImage: String
});

module.exports = mongoose.models.Case || mongoose.model('Case', caseSchema);
