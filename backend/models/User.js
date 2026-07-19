const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema(
{
    // ==========================
    // Personal Information
    // ==========================

    firstName:{
        type:String,
        required:[true,"First name is required"],
        trim:true
    },


    lastName:{
        type:String,
        required:[true,"Last name is required"],
        trim:true
    },


    email:{
        type:String,
        unique:true,
        sparse:true,
        lowercase:true,
        trim:true
    },


    phone:{
        type:String,
        required:function(){
            return !this.isChild;
        },
        unique:true,
        sparse:true,
        trim:true
    },


    password:{
        type:String,
        required:function(){
            return !this.isChild;
        },
        minlength:6,
        select:false
    },


    profileImage:{
        type:String,
        default:""
    },


    gender:{
        type:String,
        enum:[
            "Male",
            "Female"
        ],
        required:true
    },


    dateOfBirth:{
        type:Date,
        required:true
    },


    maritalStatus:{
        type:String,
        enum:[
            "Single",
            "Married",
            "Divorced",
            "Widowed"
        ],
        default:"Single"
    },


    occupation:{
        type:String,
        trim:true,
        default:""
    },


    address:{
        type:String,
        trim:true,
        default:""
    },


    gpsLocation:{
        latitude:Number,
        longitude:Number
    },


    emergencyContact:{
        type:String,
        trim:true,
        default:""
    },


    emergencyPhone:{
        type:String,
        trim:true,
        default:""
    },



    // ==========================
    // Child Information
    // ==========================


    school:{
        type:String,
        trim:true,
        default:""
    },


    schoolClass:{
        type:String,
        trim:true,
        default:""
    },



    // ==========================
    // Church Information
    // ==========================


    membershipNumber:{
        type:String,
        unique:true,
        sparse:true
    },


    joinedChurchDate:{
        type:Date,
        default:Date.now
    },


    baptized:{
        type:Boolean,
        default:false
    },


    branch:{
        type:String,
        default:"Main Branch"
    },


    department:{
        type:String,
        default:""
    },


    cellGroup:{
        type:String,
        default:""
    },


    area:{
        type:String,
        default:""
    },


    membershipType:{
        type:String,
        enum:[
            "Visitor",
            "New Convert",
            "Member",
            "Worker",
            "Leader",
            "Pastor"
        ],
        default:"Member"
    },


    role:{
        type:String,
        enum:[
            "Member",
            "Child",
            "Leader",
            "Pastor",
            "Admin"
        ],
        default:"Member"
    },


    status:{
        type:String,
        enum:[
            "Active",
            "Inactive",
            "Transferred",
            "Suspended"
        ],
        default:"Active"
    },


    isActive:{
        type:Boolean,
        default:true
    },


    registrationSource:{
        type:String,
        enum:[
            "Online",
            "Parent",
            "Admin",
            "Import",
            "Visitor"
        ],
        default:"Online"
    },



    // ==========================
    // Family Relationship
    // ==========================


    isChild:{
        type:Boolean,
        default:false
    },


    // Parent of this child

    parent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },


    // Guardian if different from parent

    guardian:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },


    // Parent's children

    children:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],


    // Who created this record

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },


    // Connect family members

    familyId:{
        type:String,
        index:true,
        default:null
    },



    // ==========================
    // Attendance Information
    // ==========================


    attendancePercentage:{
        type:Number,
        default:0,
        min:0,
        max:100
    },


    lastAttendance:{
        type:Date,
        default:null
    },



    // ==========================
    // Account Information
    // ==========================


    isVerified:{
        type:Boolean,
        default:false
    },


    phoneVerified:{
        type:Boolean,
        default:false
    },


    lastLogin:{
        type:Date,
        default:null
    }


},
{
    timestamps:true
});



// ==========================
// Password Hashing
// ==========================


userSchema.pre(
"save",
async function(next){

    if(!this.isModified("password")){
        return next();
    }


    const salt =
        await bcrypt.genSalt(10);


    this.password =
        await bcrypt.hash(
            this.password,
            salt
        );


    next();

});



// ==========================
// Password Comparison
// ==========================


userSchema.methods.matchPassword =
async function(password){

    return await bcrypt.compare(
        password,
        this.password
    );

};



// ==========================
// Full Name Virtual
// ==========================


userSchema.virtual("fullName")
.get(function(){

    return `${this.firstName} ${this.lastName}`;

});



// ==========================
// Age Virtual
// ==========================


userSchema.virtual("age")
.get(function(){

    if(!this.dateOfBirth){
        return null;
    }


    const today = new Date();

    const birthDate =
        new Date(this.dateOfBirth);


    let age =
        today.getFullYear()
        -
        birthDate.getFullYear();


    const month =
        today.getMonth()
        -
        birthDate.getMonth();



    if(
        month < 0 ||
        (
            month === 0 &&
            today.getDate() < birthDate.getDate()
        )
    ){

        age--;

    }


    return age;

});



// Include virtual fields

userSchema.set(
"toJSON",
{
    virtuals:true
});


userSchema.set(
"toObject",
{
    virtuals:true
});



module.exports =
mongoose.model(
    "User",
    userSchema
);