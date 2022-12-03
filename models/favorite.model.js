const mongoose = require("mongoose");
const FavoriteSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId,ref:"User", required: true },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                title:{type:String},
                price:{type:Number},
                ProductIMG:{type:String},
                isFavorite:{type:Boolean,default:false}
            },
        ],

    },
    { timestamps: true }
);
module.exports = mongoose.model("Favorite", FavoriteSchema);
