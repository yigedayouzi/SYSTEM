const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");
const passport = require("passport");

const User = require('../../models/User');

//$route GET api/users/test
//$desc 返回请求的json数据
//@access public
//router.get("/test", (req, res) => {
//   res.json({ msg: "login works" })
//})

//$route POST api/users/test
//$desc 返回请求的json数据
//@access public
router.post("/register", (req, res) => {
    //console.log(req.body);

    //查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json("邮箱已注册!")
            } else {

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    identity: req.body.identity
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {

                        if (err) throw err;


                        newUser.password = hash;

                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });

            }
        })

})

//$route POST api/users/login
//$desc 返回token jwt passport
//@access public
router.post("/login", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const identity = req.body.identity;


    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json("用户不存在");
            }

            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = {
                            id: user.id,
                            name: user.name,
                            identity: user.identity
                        };
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 36000}, (err, token) => {
                            if (err) throw err;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            })
                        })
                        //      res.json({ msg: "success" });
                    } else {
                        return res.status(400).json("密码错误");
                    }
                })
        })
})

//$route GET  api/users/current
//$desc return current user
//@access Private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        identity: req.user.identity
    });
})


//$route GET api/users/theuser
//$desc 获取所有用户信息
//@access Private
router.get(
    "/theuser",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            identity: req.body.identity
        });
        User.find()
            .then(user => {
                
                if (!user) {
                    return res.status(404).json("没有任何内容");
                    console.log("无内容");
                }

                res.json(user);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route  POST api/users/delete/:id
// @desc   删除用户接口
// @access Private
router.delete(
    "/delete/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      User.findOneAndRemove({ _id: req.params.id })
        .then((user) => {
          res.json(user);
        })
        .catch((err) => res.status(404).json("删除失败!"));
    }
    // Profile.deleteOne({ _id: req.params.id })
    //   .then(profile => {
    //     profile.save().then(profile => res.json(profile));
    //   })
  );


  
//$route POST api/users/edit
//$desc 编辑用户信息接口
//@access Private
router.post("/edit/:id",
 passport.authenticate("jwt", { session: false }),
  (req, res) => {

    const profileFields = {};
    if (req.body.name) profileFields.name = req.body.name;

    User.findOneAndUpdate(
        { _id: req.params.id },
        { $set: profileFields},
        { new: true }
    ).then(user => res.json(user))

}
);
module.exports = router;