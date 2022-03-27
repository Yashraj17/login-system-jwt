const { countDocuments } = require("../Model/attendanceModel");
const attendanceModel = require("../Model/attendanceModel");
const studentModel = require("../Model/studentModel")

class studentController{

    static homePage = async (req,res) =>{
        const user_id = req.user._id;
        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; 
        var dd = today.getDate();
        const currentDate = dd +'-'+ mm +'-'+ yyyy
        var Check_Attend = await attendanceModel.findOne({date:currentDate})
        if (Check_Attend !== null) {
            var data = await studentModel.find({teacher_id:user_id})
            res.render('home',{
                name:req.user,
                result : data,
                date:currentDate
            })
        } else {
            await studentModel.updateMany(
                {
                    $or : [ 
                        {"status": -1},
                        {"status": 1}
                    ]       
                },
                {
                    status:0
                }
            )
            var data = await studentModel.find({teacher_id:user_id})
            res.render('home',{
                name:req.user,
                result : data,
                date:currentDate
            })
        }
     
    }

    static InsertStudent= async (req,res)=>{
        const user_id = req.user._id;
        const {studentName,rollNo,course,branch,semester} =req.body
        const student = await studentModel.findOne({
            studentName:studentName,
            rollNo:rollNo,
            course:course,
            branch:branch,
            semester:semester
        })
        console.log(student);
        if (student !== null) {
            req.flash("danger",'Student Already exits')
            res.redirect('/home')
           
        } else {
                   if (studentName && rollNo && course && branch && semester) {
            const data = new studentModel({
                teacher_id:user_id,
                studentName:studentName,
                rollNo:rollNo,
                course:course,
                branch:branch,
                semester:semester
            })
            await data.save();
            req.flash("success",'New Student Record Created')
            res.redirect('/home')
        }
        else{
            req.flash("danger",'All field requird')
            res.redirect('/home')
        }
        }
        
    }
    static presentStudent = async (req,res)=>{
        const user_id = req.user._id;
        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; 
        var dd = today.getDate();
        const currentDate = dd +'-'+ mm +'-'+ yyyy

        const student_id = req.params.std_id;
        var data = await attendanceModel.findOne({date:currentDate,teacher_id:user_id})
        if (data === null) {
            var data = new attendanceModel({
                date:currentDate,
                attendance:[
                    {
                        student_id:student_id,
                        status:'P'
                    }
                ],
                teacher_id:req.user._id
            })
            await data.save();
            await studentModel.findByIdAndUpdate(student_id,{status:1})
            res.redirect('/home')
        } else {
            data.attendance.push({
                student_id:student_id,
                status:'P'
            })
            await data.save();
            await studentModel.findByIdAndUpdate(student_id,{status:1})
            res.redirect('/home')
        }
    }
    ////////////////function for absent student
    static absentStudent = async (req,res)=>{
        const user_id = req.user._id;
        const today = new Date();
        const yyyy = today.getFullYear();
        var mm = today.getMonth() + 1; 
        var dd = today.getDate();
        const currentDate = dd +'-'+ mm +'-'+ yyyy

        const student_id = req.params.std_id;
        var data = await attendanceModel.findOne({date:currentDate,teacher_id:user_id})
        if (data === null) {
            var data = new attendanceModel({
                date:currentDate,
                attendance:[
                    {
                        student_id:student_id,
                        status:"A"
                    }
                ],
                teacher_id:req.user._id
            })
            await data.save();
            await studentModel.findByIdAndUpdate(student_id,{status:-1})
            res.redirect('/home')
        } else {
            data.attendance.push({
                student_id:student_id,
                status:'A'
            })
            await data.save();
            await studentModel.findByIdAndUpdate(student_id,{status:-1})
            res.redirect('/home')
        }
    }

    static checkRecord =async (req,res)=>{
        
        const attendance_data = await attendanceModel.find({teacher_id:req.user._id}).populate('attendance.student_id')
        console.log(typeof(attendance_data));
        if (attendance_data == '') {
            res.render('attendanceRecord',{
                name:req.user,
                message:"No Records founds till Date"

            })
        }
        else{
            res.render('attendanceRecord',{
                name:req.user,
                result:attendance_data,
            })
        }
   
    }
}

module.exports = studentController