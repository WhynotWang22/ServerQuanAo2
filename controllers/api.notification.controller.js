const notiModel = require('../models/notification.model');

exports.getAllNoti = async (req,res,next) =>{
    const  itemList = await notiModel.find();
    res.send(itemList)
}