const conn = require('../connection/index')
const router = require('express').Router()
const path = require('path')

const multer = require('multer')
//const sharp = require('sharp')
const fs = require('fs')
// const mailVerify = require('../email/nodemailer')
const rootdir = path.join(__dirname , '/../..' )
const transferdir = path.join (rootdir , '/upload/transfer_avatar')


const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,transferdir)
        },
        filename: function(req,file,cb){
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer (
    {
        storage : folder,
        limits : {
            fileSize : 2000000000 //bytes
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


// si user kan dia add ke table checkout dulu, nah nanti si admin bakal isi admin_id sama verifie bukti transfernya. V
// post without admin_id, verified false..V
// patch with admin_id and verified V
// patch ulang ketika gagal verified 




router.post('/checkout', upstore.single('transfer_avatar'), (req, res) => {
    const sql = `INSERT INTO checkout SET ?`
    const sql2 = `SELECT * FROM checkout WHERE id = ?`
    const data = req.body
    const sqlUpdateOldCart = `UPDATE CART SET ? WHERE id = ${data.cart_id}`
    const sqlCreateCart = `INSERT INTO cart set ?`
    // console.log(data)
    
    const checkout = {
        cart_id : data.cart_id,
        price_sum : data.price_sum,
        // quantity : data.quantity,
        transfer_avatar : req.file.filename
    }
    
    conn.query(sql, checkout, (err, result) => {
        if(err) return res.send(err)
        console.log(err)
        console.log(result)

        conn.query(sqlUpdateOldCart, {
            is_checkout: true
        }, (err) => {
            if (err) return res.send(err).status(500)
            conn.query(sqlCreateCart, {
                users_id : data.users_id
            }, (err) => {
                if (err) return res.send(err).status(500)
                conn.query(sql2, result.insertId, (err, result2) => {
                    if(err) return res.send(err).status(500)
        
                    
                    res.send(result2[0])
                    console.log(err)
                })
            })
            
        })

          
    })

    })


    router.get('/checkout/user/:user_id', (req, res) => {
        const sql = `select * from checkout`
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)
            console.log(err)
            
            // conn.query(sql2, result.insertId, (err, result2) => {
            //     if(err) return res.send(err).status(500)
    
                
                res.send(result)
                console.log(result)
        })
    }
    )

    router.get('/checkout/:cart_id', (req, res) => {
        const sql = `select * from checkout where cart_id = ${req.params.cart_id}`
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)
            console.log(err)
            
           
                res.send(result[0])
                console.log(result)
        })
    }
    )

    // get all checkout to be verified
    router.get('/checkout/', (req, res) => {
        const sql = `select checkout.id, price_sum, transfer_avatar, verified, checkout.created_at, checkout.updated_at, product_id, name_product, cart_product.quantity
                    from checkout 
                    join cart on cart.id = checkout.cart_id
                    join cart_product on cart_product.cart_id = checkout.cart_id
                    join products on products.id = cart_product.product_id`
        conn.query(sql, (err, result) => {
            if(err) return res.send(err)
            console.log(err)
            
            // conn.query(sql2, result.insertId, (err, result2) => {
            //     if(err) return res.send(err).status(500)
    
                
                res.send(result)
                console.log(result)
        })
    }
    )


    // GET AVATAR BUKTI TRANSAKSI
    router.get('/checkout/transfer_avatar/:photo', (req, res) => {
    
        const options = {
            root: transferdir
        }
    
        const data = req.params.photo
    
        res.sendFile(data, options, function(err){
            if(err) return res.send(err)
    
        })
    
    })



    // VERIFIED CHECKOUT AND BUKTI TRANSAKSI
    router.patch('/checkout/:id', (req, res) => {
        
        const data = req.body
        const checkout_verified = true
        //const checkout_verified0 = false
        const sql = `UPDATE checkout SET ? WHERE id = ${req.params.id}`
        // console.log(data)
        //const sql1 = `select * from cart where users_id = ${data.id} and checkout verified = ${chekout_verified0} `
        // const sql2 = `Update cart SET checkout_verified = ${checkout_verified} where id = ${data.cart_id}`
        

        const checkout = {
            admin_id : data.admin_id,
            verified: data.verified
        }
        
        conn.query(sql, checkout, (err, result) => {
            if(err) return res.send(err)
            console.log(err)
            return res.json({
                ok: true
            })
            // conn.query(sql2, result.insertId, (err, result2) => {
            //     if(err) return res.send(err).status(500)
            // catatan, patch cart_product V
            //console.log(result[0].cart_id)
            
            // conn.query(sql2, (err, result2) => {
            //     if(err) return res.send(err)
            //     console.log(err)
                
            //      res.send(result2[0])

            //     console.log(result2[0])

            // }) 
               
            //})  
        })
    
        })
    

        // setelah checkout, kalau dia mau belanja, dibikin query buat nge add cart dengan iduser yang sama 

        module.exports = router

        // disini aja nanti 
        