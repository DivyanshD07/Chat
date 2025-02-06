import mongoose from "mongoose";
// import CryptoJS from "crypto-js";

const messageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // Encrypted field
        encryptedMessage: {
            type: String,
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// // Encryption before saving
// messageSchema.pre("save", function( next ) {
//     if(!this.isModified("encryptedMessage")) return next();

//     const secretKey = process.env.MESSAGE_SECRET;
//     this.encryptedMessage = CryptoJS.AES.encrypt(this.encryptedMessage, secretKey).toString(); //store encrypted message
//     next();
// });

// // Decryption before saving
// messageSchema.methods.decryptMessage = function () {
//     const secretKey = process.env.MESSAGE_SECRET;
//     const bytes = CryptoJS.AES.decrypt(this.encryptedMessage, secretKey);
//     return bytes.toString(CryptoJS.enc.Utf8);
// }

const Message = mongoose.model("Message", messageSchema);
export default Message;