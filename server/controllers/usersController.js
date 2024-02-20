const user = require("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => { 
    try {
    const { username, email, password } = req.body;
    const usernameCheck = await user.findOne({ username });
    if (usernameCheck)
        return res.json({ msg: "Username already used.", status: false });
    const emailCheck = await user.findOne({ email });
    if (emailCheck)
        return res.json({ msg: "Email already exists.", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const User = await user.create({
        email,
        username,
        password: hashedPassword,
    });
    delete User.password;
    return res.json({ status: true, User });
    } catch(ex) {
        next(ex);
   }
};


module.exports.login = async (req, res, next) => { 
    try {
    const { username, password } = req.body;
    const User = await user.findOne({ username });
    if (!User)
        return res.json({ msg: "Incorrect username or password.", status: false });
    const isPsswordValid = await bcrypt.compare(password, User.password);
    if (!isPsswordValid)
        return res.json({ msg: "Incorrect username or password.", status: false });
    delete User.password;

    return res.json({ status: true, User });
    } catch(ex) {
        next(ex);
   }
};

module.exports.setAvatar = async (req, res, next) => { 
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await user.findByIdAndUpdate(userId,
            {
                isAvatarImageSet: true,
                avatarImage,
            });
        return res.json({ isSet: userData.isAvatarImageSet, image: userData.avatarImage });
    } catch (ex){
        next(ex);
    }
};

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await user.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
}


