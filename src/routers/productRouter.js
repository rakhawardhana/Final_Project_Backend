const conn = require('../connection/index')
const router = require('express').Router()
const path = require('path')
const multer = require('multer')
//const sharp = require('sharp')
const fs = require('fs')
// const mailVerify = require('../email/nodemailer')
const rootdir = path.join(__dirname , '/../..' )
const productdir = path.join (rootdir , '/upload/avatar')



const folder = multer.diskStorage(
    {
        destination: function(req,file,cb){
            cb(null,productdir)
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
            fileSize : 200000000 //bytes
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

// ADD PRODUCT
router.post('/products', upstore.single('avatar'), (req, res) => {
    const sql = `INSERT INTO products SET ?`
    const sql2 = `SELECT * FROM products WHERE id = ?`
    const data = req.body
    // console.log(data)

    const product = {
        category_id : data.category_id,
        name_product : data.name_product,
        description : data.description,
        price : data.price,
        quantity : data.quantity,
        avatar : req.file.filename
    }
    
    conn.query(sql, product, (err, result) => {
        if(err) return res.send(err)
        console.log(err)
        
        conn.query(sql2, result.insertId, (err, result2) => {
            if(err) return res.send(err).status(500)

            
            res.send(result2[0])
            console.log(err)
        })  
    })

    
})


// ADD PRODUCT UNTUK RENDER CATEGORY
router.get('/categories', (req, res) => {
    const sql = `SELECT id, category_product FROM category`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)
        console.log(result)
        res.send(result)
    })
})


// get product by id
router.get('/products/:id', (req, res) => {
    const sql = `SELECT * FROM products
                WHERE id = ?`
    const data = req.params.id

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        res.send(result[0])
    })
})



// get all product
router.get('/products', (req, res) => {
    const sql = `select * from products join category on products.category_id = category.id`
    

    conn.query(sql, (err, result) => {
        if(err) return res.send(err)

        res.send(result)
    })
})


router.patch('/products/:product_id', upstore.single('avatar'),(req,res)=>{
    const sql = `UPDATE products SET ? WHERE id = ${req.params.product_id}`
    const data = req.body
    console.log(req.file)

    const products = {
        category_id : data.category_id,
        name_product : data.name_product,
        description : data.description,
        price : data.price,
        quantity : data.quantity,
        avatar : req.file.filename
    }

    conn.query(sql,products,(err,result)=>{
        if(err){
            return res.send(err).status(500)
        }

        res.send(result)
        
    })
})

router.get('/products/avatar/:photo', (req, res) => {
    
    const options = {
        root: productdir
    }

    
    const data = req.params.photo

    res.sendFile(data, options, function(err){
        if(err) return res.send(err)

    })

})


router.delete('/products/:id',(req,res)=>{
    const sql = `DELETE FROM products WHERE id = ${req.params.id}`

    conn.query(sql,(err,results)=>{
        if(err){
            return res.send(err)
        }
        res.send(results)
    })
})



module.exports = router

