const UserModel = require('../models/user.model');
const bcrypt = require("bcrypt");
const fs = require('fs');
const {streamUpload} =require('../utils/UploadIMG');
const IMGModel = require("../models/Img.model");
const layout =require('chart.js')

//hien thi danh sach User
exports.getListUSer=async(req,res,next)=>{
    var listUser = await UserModel.find({role:"User"});
    res.render('./User/list-User',{listUser:listUser});
}
//list admin
exports.getListAdmin=async(req,res,next)=>{
    var ListAdmin = await UserModel.find({role:"Admin"});
    res.render('./User/list-Admin',{ListAdmin:ListAdmin});
}
exports.getFormLogin =  (req,res,next)=>{
    res.render('./User/login');
}
//hien thi form add
exports.GetFormAddUser=(req,res,next)=>{
    res.render('./User/add-User');
}
//xu li them vao csdl
exports.postAddUser= async (req,res,next)=>{
    const salt = await bcrypt.genSalt(10);
    let result;
    let filename
    if (req.file){
        result = await streamUpload(req);
        filename=result.url
    }else {
        const Avatar = await IMGModel.findById({_id:"6366274f29d343cc922c5946"});
        result = Avatar.IMG;
        filename=result;
    }
 const newUser = new UserModel({
     email:req.body.user_email,
     password: await bcrypt.hash(req.body.user_password,salt),
     full_name:req.body.user_full_name,
     address:req.body.user_address,
     phone_number:Number(req.body.user_phone_number),
     role:req.body.role,
     avatar:filename
 });
 await newUser.save(function (err){
     if (err){
         console.log(err);
     }else {
         console.log('ghi du lieu thanh cong')
     }
 })


    res.redirect('/users/add')
}
//xu li lay form edit
exports.getFormEditUser=async (req,res,next)=>{
    let UserData =await UserModel.findById(req.params.id).exec().
        catch(function (err) {
        console.log(err);
    });
    if (UserData ==null){
        res.send('Không tìm thấy bản ghi');
    }
    res.render('./User/update-User',{UserData:UserData});
}
exports.getPostEditUser= async (req,res,next)=>{
    let condition ={
        _id : req.params.id // lay id tren thanh dia chi
    }
    let result = await streamUpload(req);
    let du_lieu={};
if (result == null){
    du_lieu = {
        email:req.body.user_email,
        full_name:req.body.user_full_name,
        address:req.body.user_address,
        phone_number:Number(req.body.user_phone_number),
        role:req.body.role,
    }
}else {
    du_lieu = {
        email:req.body.user_email,
        full_name:req.body.user_full_name,
        address:req.body.user_address,
        phone_number:Number(req.body.user_phone_number),
        role:req.body.role,
        avatar:result.url
    }
}


    //goi lenh update
    UserModel.updateOne(condition,du_lieu,function (err,res){
        if (err)
        {
            console.log("Loi update"+err.message,{msg:'Lỗi update'})
        }
    })
    res.redirect('/users/');
}
//xu li delete
exports.getFormDelete = async (req,res,next)=>{
    let dieu_kien ={
        _id : req.params.id // lay id tren thanh dia chi
    }
    //goi lenh update
    UserModel.deleteOne(dieu_kien,function (err,res){
        if (err)
        {
            console.log("Loi del"+err.message,{msg:'Lỗi del'})
        }
    })
    res.redirect('back');
}

//get user
exports.getUser =(req,res,next)=>{
    res.render('account',{users:req.session.user});
    console.log(req.session.user)
}
//log out
exports.Logout = (req,res,next)=>{
    req.session.destroy(function (){
        console.log("Dang xuat thanh cong");
    });
    res.redirect('/login');
}