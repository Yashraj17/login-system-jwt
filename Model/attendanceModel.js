const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema({
    date:{type:String,required:true},
    attendance:[
        {
            student_id:{type:mongoose.Schema.Types.ObjectId,ref:'student'},
            status:{type:String,default:'A'}
        }
    ],
    teacher_id:{type:mongoose.Schema.Types.ObjectId,ref:'user'}
    
})
const attendanceModel = mongoose.model('attendance',attendanceSchema);
module.exports= attendanceModel;