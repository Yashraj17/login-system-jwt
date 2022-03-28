const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    studentName:{type:String,required:true},
    course:{type:String,required:true},
    semester:{type:String,required:true},
    branch:{type:String,required:true},
    reader_id:{type:Number,required:true},
    status:{type:Number,required:true,default:0}
})
const studentModel = mongoose.model('student',studentSchema);
module.exports= studentModel;