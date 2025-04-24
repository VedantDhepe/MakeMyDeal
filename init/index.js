 const mongoose = require('mongoose');
 const initData = require('./data.js');
 const Listing = require('../models/listing.js');
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/MakeMyDeal');
 }
main().then((res) => console.log("Connected to Database Successfully")) 
.catch((err) => console.log(err));

 

 let initDB = async () => {
    await Listing.deleteMany({});
    console.log("Data Deleted");
    initData.data = initData.data.map((obj) => 
      ({...obj, owner : '67f13b939e09ce7e258ee476' }));

    await Listing.insertMany(initData.data);
    console.log("Data initiated");
    console.log("Data initialized");
 }

 initDB();