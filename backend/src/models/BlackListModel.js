const mongoose = require("mongoose")

const blacklistSchema = mongoose.Schema({
    token:{type: String, required: true}
}, {
    versionKey: false
})

const BlackListModel = mongoose.model("blacklistToken", blacklistSchema)

module.exports = { BlackListModel }