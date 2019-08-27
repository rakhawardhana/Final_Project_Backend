const conn = require('../connection/index')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
//const mailVerify = require('../email/nodemailer')
const rootdir = path.join(__dirname , '/../..' )
const userdir = path.join (rootdir , '/upload/userPhotos')



const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,userdir)
        },
        filename: function(req,file,cb){
            console.log(req.body)
            // cb(null, Date.now() + '-' + req.body.username + path.extname(file.originalname))
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer (
    {
        storage : folder,
        limits : {
            fileSize : 2000000 //bytes
        },
        fileFilter(req,file,cb){
            let photo = file.originalname.match(/\.(jpg|jpeg|png|gif)$/)

            if(!photo){
                cb(new Error('Masukan file dengan extensin jpg, jpeg, png atau gif'))
            }

            cb(undefined, true)
        }
    }
)




//bikin user baru
// gimana caranya kalo register cartnya nambah
router.post('/users', (req,res) => {
    const sql = `INSERT INTO users set ?`
    
    const data = req.body

    //validate email
    if(!isEmail(data.email)){
        return res.send('please input a correct Email')
    }

    //hash password
    data.password = bcrypt.hashSync(data.password, 8)


    conn.query(sql,data, (err,result1) => {
        if(err){
            return res.send(err)
        }
        console.log(result1)
        //return res.send(result1)
        const sql2 = `INSERT INTO cart set ?`
        conn.query(sql2,{users_id: result1.insertId}, (err,result2) => {
            if(err){
                return res.send(err)
            }
            res.send(result2[0])

            //mailVerify(result2[0])
        })
    })
})




// LOGIN
router.post('/users/auth', (req,res) => {
    //const sql2 = `SELECT username, email, password from users where username = '${req.body.username}' or email ='${req.body.email}' and password = '${req.body.password}'`
    const sql2 = `SELECT * from users where email = '${req.body.email}'`
    
    const data = req.body
    
        conn.query(sql2, (err,result2) => {
            //Object.values(data)
            if(err){
                console.log(err)
                return res.json({message: "gagal login"})
                //console.log(err)
            }
            else {
                if (result2.length < 1) {
                    return res.send(`password or email are incorrect`)
                }
                if (!result2) return res.send(`Invalid, cant found data, please register`)

                else {
                    bcrypt.compare(data.password, result2[0].password)
                    .then(val => {
                        if (val === false) return res.send(`password are incorrect`)
                        res.send(result2[0])
                    })
                }
            }
           
                // bcrypt.compare(data.password, result2[0].password, (err, res) => {
                //     if(res) {return res.send(result2[0])}
                
                // })

            console.log(result2)
            })
        
         })



// READ PROFILE
router.get('/users/:id', (req, res) => {
    const sql = `SELECT * FROM users where id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)    

        res.send(result)
    })
})

router.get('/users/avatar/:avatar', (req, res) => {
    // Letak folder photo
    const options = {
        root: userdir
    }

    // Filename / nama photo
    const data = req.params.avatar

    res.sendFile(data, options, function(err){
        if(err) return res.send(err)

    })

})



router.patch('/users/:id', upstore.single('avatar'),(req,res)=>{
    const sql = `UPDATE users SET ? WHERE id = ${req.params.id}`
    const data = req.body
    //console.log(req.file)

    const users = {
       first_name: data.first_name,
       last_name: data.last_name,
       email: data.email,
       avatar : req.file.filename

    }

    conn.query(sql,users,(err,result)=>{
        if(err){
            return res.send(err).status(500)
        }

        res.send(result)
        
    })
})
module.exports = router