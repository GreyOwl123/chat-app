const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
});

MessageSchema.virtual("url").get(function () {
  return `/api/message/${this._id}`;
});

module.exports = mongoose.model("Message", MessageSchema);

