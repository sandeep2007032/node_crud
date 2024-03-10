const express = require('express');
const router = express.Router();
const User=require('../models/users');
const multer = require('multer');
const fs=require('fs');

//image upload

var storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname + "_" +Date.now() +"_" + file.originalname);
    },
});

var upload=multer({
    storage:storage,
}).single('image');


//insert an userr into database route
router.post('/add', upload, (req, res) => {
    const {name,email,phone,} = req.body;
    const user=new User({
        name : name ,
        email : email ,
        
        phone : phone ,
        image : req.file.filename,

  });
    // const user=new User({
    //     name : req.body.name ,
    //     email : req.body.email ,
        
    //     phone : req.body.phone ,
    //     image : req.file.filename,

    // });
    // user.save((err)=>{
    //     if(err){
    //         console.log(err);
    //         res.json({text: err.text ,type: "danger"});
    //     }else{
    //         req.session.text={
    //             type:"success",
    //             text:"User add succuesfully"
                
    //         };
    //         res.redirect('/');
    //     }
    // });
    user.save().then(savedUser =>{
        // res.status(200).json({
        //     type:"success",
        //     message:"User add succuesfully"
        // });
        res.redirect('/');
    }).catch(err =>{
        console.log(`>>> ${err}`);
        res.json({message: err.message ,type: "danger"});
    });
});





// user.save().then(savedUser => {
//     res.redirect('/?type=success&message=User added successfully');
// }).catch(err => {
//     console.log(`>>> ${err}`);
//     res.redirect('/?type=danger&message=' + encodeURIComponent(err.message));
// });












///get all user route





// Define your routes here
// router.get('/', (req, res) => {
//   User.find().exec((err,users)=>{
//     if(err){
//         res.json({  message: err.message});

//     }else{
//         res.render('index',{
//             title:'Users' ,
//             users:users,
//         })

//     }
//   })
// });

// router.get('/', (req, res) => {
//     res.render("index",{title: "home page"});
//   });

router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.render('index', { title: 'User List', users: users }); // Pass title and users data to the view for rendering
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





  router.get('/add', (req, res) => {
    res.render("add_users",{title: "Add Users"});
  });
  
  ///edit an user
  
  router.get("/edit/:id", (req, res) => {
    let id = req.params.id;
    User.findById(id)
        .then(user => {
            if (!user) {
                res.redirect("/");
            } else {
                res.render('edit_users', {
                    title: 'Edit User',
                    user: user,
                });
            }
        })
        .catch(err => {
            console.error(err);
            res.redirect("/");
        });
});



///update user route

router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image,
    })
        .then(result => {
            req.session.message = {
                type: 'success',
                message: 'User update',
            };
            res.redirect("/");
        })
        
        .catch(err => {
            console.log(err); // Log the error to see its contents
            res.json({ message: err ? err.message : "Unknown error", type: 'danger' });
        });
        
});
//routes to delete

router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const result = await User.findByIdAndDelete(id);
        if (result && result.image !== 'no-img.jpg') {
            try {
                fs.unlink('./uploads/' + result.image);
            } catch (err) {
                console.log(err);
            }
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error in deleting user" });
    }
});



          




module.exports = router;
