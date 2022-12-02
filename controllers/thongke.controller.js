const OrderModel =require('../models/order.model');
const ProductModel =require('../models/product.model');
const moment = require('moment')
const {format2} = require('../utils/DateFormat');


exports.getFormAdd =async (req,res)=>{
    let Allincome =0;
    let AllPendingOrder =0;
    let AllConfirmedOrder =0;
    let AllDeliverOrder =0;
    let AllSuccessOrder =0;
    let AllOrder =0;
     //find all status
    const FindAllOrder= await OrderModel.find();
    if (FindAllOrder.length ==null){
        return res.status(404).json({message:"không tìm thấy bản ghi nào"});
    }
    for(let i =0;i<FindAllOrder.length;i++){
        Allincome += FindAllOrder[i].Total;
        AllOrder++
        if (FindAllOrder[i].status ==='Đang chờ xác nhận'){
            AllPendingOrder++
        }else if (FindAllOrder[i].status ==="Đang chuẩn bị hàng"){
            AllConfirmedOrder++
        }else if (FindAllOrder[i].status ==='Đang giao hàng'){
            AllDeliverOrder++
        }
        else if (FindAllOrder[i].status ==='Giao hàng thành công'){
            AllSuccessOrder++
        }
    }
    let formatIncome= format2(Allincome,' vnd');
    //find top 10 product sold
    let Top10Product =  await ProductModel.find().sort({"sold":-1}).limit(10)
    //find all stock left
    let AllStockProducts = await ProductModel.find();
    console.log(AllStockProducts);
    let StockLeft =0;
    for (let i=0;i<AllStockProducts.length;i++){
        let StockIn = AllStockProducts[i].stock;
      if ( StockIn>=0){
          StockLeft +=StockIn;
      }
    }
   let objStatus = {
        AllOrder,
        AllPendingOrder,
        AllConfirmedOrder,
        AllDeliverOrder,
        AllSuccessOrder,
       formatIncome,
       StockLeft
    }
        res.render('./thongke/dash',{objStatus:objStatus,objTop10Product:Top10Product});
}
exports.getFilter = async (req,res)=>{
 //get start of the day
    const today = moment().startOf('day')
  const findOrderbyday = await OrderModel.find({
      createdAt:{
          $gte: today.toDate(),
          $lt:moment(today).endOf('day').toDate()
      }
  });
    if (findOrderbyday == null){
        return res.status(404).send({
            message:"Không tìm thấy bản ghi nào vào ngày hôm nay"
        });
    }else {

        let AmountByDay=0;
        await findOrderbyday.map(item => {
            return AmountByDay +=item.Total
        })
        res.status(200).json({
            AmountByDay
        });
    }
}

exports.getFilterWeek = async (req,res)=>{
    var now = moment();
    const hours = 0;
    const minutes = 0;
    var monday = now.clone().weekday(1).set("hour", hours).set("minute", minutes).toDate();
    var sunday = now.clone().weekday(7).set("hour", hours).set("minute", minutes).toDate();
    console.log(monday)
    console.log(sunday)
    let weeks = await OrderModel.aggregate([
        {$match: {createdAt:{$gt: monday, $lt: sunday}}},
        {
            $group: {
                _id: {
                    day: { $dateTrunc: { date: "$createdAt", unit: "day" } }
                },
                total: {$sum:"$Total"}
            }
        },
        {
            $group:{
                _id: "$_id.day",
                count: { $push: { total: "$total" } }
            }
        },
        {$sort:{_id:1}}
    ]);
    console.log(weeks);
    res.json({dayofweek:weeks});
}

exports.getDaysinmonht = async (req,res)=>{
    const startOfMonth = moment().startOf('month').subtract(-1, 'day').toDate();
    const endOfMonth   = moment().endOf('month').toDate();

    let days = await OrderModel.aggregate([
        { $match: { createdAt: { $gt: startOfMonth ,$lt:endOfMonth } } },

        {
            $group: {
                _id: {
                    day: { $dateTrunc: { date: "$createdAt", unit: "day" } }
                },
                total: {$sum:"$Total"}
            }
        },

        {
            $group: {
                _id: "$_id.day",
                count: { $push: { total: "$total" } }
            },

        }
        ,{$sort:{_id:1}}
    ])

res.json({DaysOfMonth: days});
}
//test year
exports.getMonthsInYear = async (req,res)=>{
    const startOfYear = moment().startOf('year').toDate();
    const lastDayOfYear = moment().endOf('year').toDate()
    console.log(startOfYear)
    console.log(lastDayOfYear)
    let days = await OrderModel.aggregate([
        { $match: { createdAt: { $gt: startOfYear,$lt:lastDayOfYear } } },
        {
            $group: {
                _id: {
                    month: { $month: {date:"$createdAt"} },
                    year:{$year:{date:"$createdAt"}}
                },
                total: {$sum:"$Total"}
            }
        },
        {
            $group: {
                _id: "$_id",
                count: { $push: { total: "$total" } }
            }
        },
        {$sort:{_id:1}}
    ])

    res.json({MonthOfYear: days});
}

exports.getFilterMonthtoYear =async (req,res)=>{
    const TODAY = moment().toDate();
   const FIRST_MONTH = 1;

   const LAST_MONTH  = 12;
    const MONTHS_ARRAY = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]
    const startOfYear = moment().startOf('year').subtract(-1,"day").toDate();
    console.log(startOfYear);
    const lastDayOfYear = moment().endOf('year').toDate()

    //query
    const allMonthsData = await OrderModel.aggregate([
        {
            $match:{
                createdAt:{$gt:startOfYear,$lt:lastDayOfYear}
            }
        },
        {
            $group:{
                _id:{"year_month":{$substrCP:[ "$createdAt", 0, 7 ]}},
                count:{$sum:"$Total"}
            }
        },
        {
            $sort: {"_id.year_month": 1}
        },
        {
            $project:{
                _id: 0,
                count: 1,
                month_year:{
                    $concat:[
                        {$arrayElemAt:[MONTHS_ARRAY,{$subtract:[{$toInt:{$substrCP:[ "$_id.year_month", 5, 2 ]}},1]}]},
                        "-",
                        {$substrCP:["$_id.year_month",0,4]}

                    ]
                }
            }
        },
        {
            $group:{
                _id:null,
                data:{$push:{ k: "$month_year", v: "$count" }}
            }
        },
        {
            $addFields: {
                start_year: { $substrCP: [ startOfYear, 0, 4 ] },
                end_year: { $substrCP: [ TODAY, 0, 4 ] },
                months1: { $range: [ { $toInt: { $substrCP: [ startOfYear, 5, 2 ] } }, { $add: [ LAST_MONTH, 1 ] } ] },
                months2: { $range: [ FIRST_MONTH, { $add: [ { $toInt: { $substrCP: [ TODAY, 5, 2 ] } }, 1 ] } ] }
            }
        },
        {
            $addFields: {
                template_data: {
                    $concatArrays: [
                        { $map: {
                                input: "$months1", as: "m1",
                                in: {
                                    count: 0,
                                    month_year: {
                                        $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m1", 1 ] } ] }, "-",  "$start_year" ]
                                    }
                                }
                            } },
                        { $map: {
                                input: "$months2", as: "m2",
                                in: {
                                    count: 0,
                                    month_year: {
                                        $concat: [ { $arrayElemAt: [ MONTHS_ARRAY, { $subtract: [ "$$m2", 1 ] } ] }, "-",  "$end_year" ]
                                    }
                                }
                            } }
                    ]
                }
            }
        },
        {
            $addFields: {
                data: {
                    $map: {
                        input: "$template_data", as: "t",
                        in: {
                            k: "$$t.month_year",
                            v: {
                                $reduce: {
                                    input: "$data", initialValue: 0,
                                    in: {
                                        $cond: [ { $eq: [ "$$t.month_year", "$$this.k"] },
                                            { $add: [ "$$this.v", "$$value" ] },
                                            { $add: [ 0, "$$value" ] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                data: { $arrayToObject: "$data" },
                _id: 0
            }
        }

    ])
    res.json({YearTomonth:allMonthsData})
}





exports.getfilterIncome =async (req,res)=>{
    let Allincome =0;
    try {
        const getAllOrder = await OrderModel.find();
        console.log(getAllOrder);
        if (getAllOrder.length ==null){
            return res.status.json({message:"không tìm thấy bản ghi nào"});
        }
            for (let i=0;i<getAllOrder.length;i++){
                Allincome += getAllOrder[i].Total;
            }

        res.status(200).json({
            Income:Allincome
        });
    }catch (err){
        return res.status(500).json({
            message:err.message
        })
    }
}