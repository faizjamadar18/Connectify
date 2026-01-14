import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    attachments: {
        image: { type: String },
        pdf: { type: String },
        video: { type: String },
    },
    message: {
        type: String,
        trim: true
    },
}, {
    timestamps: true,
});

// const Chat = mongoose.model('Chat', chatSchema);'
const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;