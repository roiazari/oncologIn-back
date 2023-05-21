const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  // כדי למנוע הצגת אזהרה
  mongoose.set('strictQuery', false);
  // וזה לווינדוס 11
  await mongoose.connect('mongodb://127.0.0.1:27017/prjectAdamRoi');
  console.log("mongo connect projectAdamRoi local");
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}