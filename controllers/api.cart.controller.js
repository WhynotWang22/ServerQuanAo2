const CartModel =require('../models/cart.model');


exports.postAddCart = async (req,res)=> {
    const { productId, title, price, img,quantity ,Amount} = req.body;

    const userId = req.user._id; //TODO: the logged in user id

    try {
        let cart = await CartModel.findOne({ userId });

        if (cart) {
            //cart exists for user
            let itemIndex = cart.products.findIndex(p => p.productId == productId);

            if (itemIndex > -1) {
                //product exists in the cart, update the quantity
                let productItem = cart.products[itemIndex];
                productItem.quantity = quantity;
                cart.products[itemIndex] = productItem;
            } else {
                //product does not exists in cart, add new item
                cart.products.push({ productId, title, price, img,quantity ,Amount });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            //no cart for user, create new cart
            const newCart = await CartModel.create({
                userId,
                products: [{ productId, title, price, img,quantity ,Amount }]
            });

            return res.status(201).send(newCart);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
}


// get all list cart by userID
exports.getAllCartByUserID = async (req,res)=>{
const user =req.user
    let cart =await CartModel.findOne({userId:user._id})
    res.send(cart);
    console.log(cart);
}
exports.DeleteCartItem =async (req,res)=>{
    const user =req.user
    const {productId} =req.body
    console.log(req.params.id)
    const cart =await CartModel.findOne({userId:user._id})
    if (!cart){
        res.json({ success: true });
    }
    const productIndex =cart.products.findIndex(item => String(item.productId)=== productId)
    if (productIndex <0){
        return res.json({success:true});
    }
    const newItems =cart.products.slice(productIndex,1);
    await CartModel.updateOne({
        _id:cart._id
    },
        {
            $set:{
                products:newItems
            }
        })
    return res.json({success:true});
}