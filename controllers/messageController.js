const messageModel = require("../model/messageModel.js");



module.exports.addMessages = async(req,res,next) => {
    try {
        const {from,to,message} = req.body;
        const data = await messageModel.create({
            message : {text : message },
            users : [from,to],
            sender : from
        })

        if(data) return res.json({msg:"Message added successfully"});
        else return res.json({msg:"Failed to add message to db"});
    } catch (error) {
        next(error);
    }
}

module.exports.getAllMessages = async(req,res,next) => {
    try {
        const {from,to} = req.body;
        const messages = await messageModel
            .find({
                users:{
                    $all:[from,to],
                },
            })
            .sort({updatedAt:1});
        
        const projectMessages = messages.map((msg) => {
            return {
                fromSelf : msg.sender.toString() === from,
                message : msg.message.text,
            }
        });

        res.json(projectMessages);

    } catch (error) {
        
    }
}


