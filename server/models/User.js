import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Connection'
    }],

});

const User = mongoose.model('User', userSchema);
export default User;