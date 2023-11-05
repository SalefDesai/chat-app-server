const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");


module.exports.register = async(req,res,next) => {
    try {
        const {username,email,password} = req.body;
        // console.log(username);
        // console.log(email);
        // console.log(password);

        const usernameCheck = await User.findOne({username});
        if (usernameCheck) {
            return res.json({message:"Username already used ",status:false});
        }

        const emailCheck = await User.findOne({email});
        if (emailCheck) {
            return res.json({message:"email already used ",status:false});
        }

        const hashedpassword = await bcrypt.hash(password,10);

        console.log(hashedpassword)

        const user = await User.create({
            username,
            email,
            password: hashedpassword
        });

        console.log("check",user);

        delete user.password;
        return res.json({status : true,user});
    } catch(ex) {
        console.log("error is " ,ex);
        next(ex);
    }

};


module.exports.login = async(req,res,next) => {

    try {
        const {username,password} = req.body;

        const user = await User.findOne({username});
        if(!user) {
            return res.json({message:"Invalid username",status:false})
        }

        const checkpassword =  await bcrypt.compare(password,user.password);
        if (!checkpassword) {
            return res.json({message:"Invalid password",status:false});
        }

        delete user.password;
        return res.json({status:true,user});
        
    } catch (err) {
        console.log("error is......... : ", err);
        next(err);
    }
}

module.exports.setAvatar = async(req,res,next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,
            avatarImage,
        });
        return res.json({
            isSet : userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (error) {
        next(error);
    }
}


module.exports.getAllUsers = async(req,res,next) => {
    try {
        const users = await User.find({_id:{ $ne : req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id"
        ]);

        return res.json(users);
    } catch (error) {
        next(error);
    }
}


module.exports.logout = async(req,res,next) => {
    try {
        const id =  req.params.id;
        const user = await User.findById(id)

        if (user) {
            return res.json({
                status:true
            })
        } else {
            return res.json({
                status:false
            })
        }

    } catch (error) {
        
    }
}