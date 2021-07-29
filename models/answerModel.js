const mongoose = require("mongoose");


const answersSchema = new mongoose.Schema({
    q1: {
        type: Boolean,
        default: false
    },
    q2: {
        type: Boolean,
        default: false
    },
    q3: {
        type: Boolean,
        default: false
    },
    q4: {
        type: Boolean,
        default: false
    }
    ,
    q5: {
        type: Boolean,
        default: false
    }
})

const Answers = mongoose.model("Answers", answersSchema);
module.exports = Answers;
