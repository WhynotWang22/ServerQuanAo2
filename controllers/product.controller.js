const productModel = require('../models/product.model');
// const  bcrypt = require('bcrypt');
const cateModel = require('../models/category.model');
const {streamUpload} =require('../utils/UploadIMG');
const fs = require('fs')

exports.getListProduct = async (req, res, next) => {
    const listProduct = await productModel.find().exec();

    res.render('./products/list', {listProduct: listProduct});

}

//get list emtySTock
exports.getListProductEmpty =async (req,res)=>{
    const listEmtyProduct = await productModel.find({stock:0})
    if (listEmtyProduct ==null){
        return  res.send('khong tim thay');
    }
    res.render('./products/listEmty', {listEmtyProduct: listEmtyProduct});

}

exports.getFormAddPro = async (req, res, next) => {
    const listCate = await cateModel.find().exec();
    const listSize = new Array("S", "M", "L", "XL", "XXl", "XXXl")
    const sizeLength = listSize.length;
    res.render('./products/add', {listCate: listCate, listSize: listSize, sizeLength});
}
exports.postAddPro = async (req, res, next) => {

    let result = await streamUpload(req.file);
    let filename= result.url;
    const product = new productModel({
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        category: req.body.cate,
        sizes: req.body.sizes,
        color: req.body.color,
        stock: req.body.stock,
        img: filename
    });


    await product.save((err) => {
        if (err) {
            console.log("loi add")
        } else {
            console.log("success")
        }
    })
    res.redirect('/pro/list');
}
exports.getFormEditPro = async (req, res, next) => {
    // console.log(req.params);
    let itemPro = await productModel.findById(req.params.id)
        .exec()
        .catch(function (err) {
            console.log(err)
        });

    if (itemPro == null) {
        res.send('khong tim thay')
    }

    res.render('./products/editpro', {itemPro: itemPro})

}
exports.postEditPro = async (req, res, next) => {
    let dieu_kien = {
        _id: req.params.id // lay id tren thanh dia chi
    }
    let itemPro = await productModel.findById(req.params.id)
        .exec()
        .catch(function (err) {
            console.log(err)
        });

    let result = await streamUpload(req);
    console.log(result);
    let du_lieu={};
if (result == null){
    du_lieu = {
        title: req.body.title,
        price: req.body.price,
        desc: req.body.desc,
        sizes: req.body.sizes,
        color: req.body.color,
        stock: req.body.stock,
    }
}else {
        du_lieu = {
            title: req.body.title,
            price: req.body.price,
            desc: req.body.desc,
            sizes: req.body.sizes,
            color: req.body.color,
            stock: req.body.stock,
            img: result.url
        }
    }


    //goi lenh update
    productModel.updateOne(dieu_kien, du_lieu, function (err, res) {
        if (err) {
            console.log("Loi update" + err.message, {msg: 'Lỗi update'})
        }
    })

    res.redirect('/pro/list');
}
exports.postDelPro = async (req, res, next) => {

    console.log(req.params.id)
    let dieu_kien = {
        _id: req.params.id
    }


    productModel.deleteOne(dieu_kien, function (err, res) {
        if (err) {
            console.log("Loi del" + err.message, {msg: 'Lỗi del'});
        }
    });
    res.redirect('/pro/list');

}