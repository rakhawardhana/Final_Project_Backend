const conn = require('../connection/index')
const router = require('express').Router()



// cek jumlah quantity product di tabel product 
    // kalau memang quantity product < quantity yang dipesan di body, kasih notif
// cek dulu di cart product, itu ada yang product_idnya sama ga
    // kalau sama, cek dulu quantity yang udah diminta + 
        //quantity yang dipesan lebih besar dari quantity produk apa enggak, 
        //kalau lebih besar, kasih notif kagak ada stok, kalau lebih kecil, eksekusi tambah 
    // kalau beda, yaudah ditambah product_idnya 
    

// patch cart_product with checkout_verified = true V


// render/ get cart_product with checkout verified = false 
// kalau user login lagi terus mau beli barang yang sama gimana? kan di table cart_product masih ada barangnya. 
    // ya gimana caranya pas post add to cart, dia ngepost baru 
    // nanti pas di post, di front end di get  



router.get('/cart/user/:user_id', (req, res) => {
    const user_id = req.params.user_id
    const sql = `SELECT * from cart where users_id=${user_id} and is_checkout=${false}`
    conn.query(sql, (err, results) => {
        if (err) return res.send(err).status(500)
        return res.json({
            cart_id: results[0].id
        })
    })
})

router.post('/cart_product',(req,res)=>{

    const data = req.body
    const sql = `SELECT * FROM products WHERE id = ${data.product_id}`
    const sql2 = `INSERT INTO cart_product SET ?`
    const sql3 = `select * from cart where users_id = ${data.id} and is_checkout=${false}`
    // const cart_productdata = {
        
    //     product_id : data.product_id,
    //     quantity : data.quantity,
        
    // }
    // console.log(sql)
    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
    
        // console.log(results)
        if(results[0].quantity > data.quantity) {
            conn.query(sql3, (err, results3) =>{
                if(err) {
                    return res.send(err)
                }  
                const cart_productdata = {
                    cart_id: results3[0].id,
                    product_id : data.product_id,
                    quantity : data.quantity,
                }
                conn.query(sql2,cart_productdata,(err,results2)=>{
                    if(err){
                        return res.send(err)
                    }
                    res.send(results2)
                })
    
            })
            
            
        } else {
           
            
            // return res.badRequest(
            //     'Transaction limit exceeded. Please try again with an amount less than ${results[0].quantity}.')
            res.status(400).send('DILARANG MELEBIHI STOCK')
        }     
    })
})

router.get('/cart_product/:id', (req, res)=> {
    const sql = `SELECT * FROM cart_product WHERE product_id = ${req.params.id}`
    console.log(sql)
    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
        
        res.send(results[0])
        console.log(results)
    })
})



router.patch('/cart_product/:id',(req,res)=>{  
    const data = req.body
    const sql = `SELECT * FROM products WHERE id = ${req.params.id}`
    const sql2 = `UPDATE cart_product SET quantity = ${data.quantity} WHERE product_id = ${req.params.id}`
    

    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
        // cek ketersediaan produk, kalau lebih besar quantity produk ya eksekusi, kalau enggak ya kasih notif
        // data.quantity di query ini merupakan hasil penjumlahan antara quantity yang dimasukin di cart_product ama yang ditambah
        if(results[0].quantity > data.quantity) {
            conn.query(sql2,(err,results2)=>{
                if(err){
                    return res.send(err)
                }
                res.send(results2)
            })
        } else {
           
            return res.status(400).send('DILARANG MELEBIHI STOCK')
        }     
        


    })
})

// get all cart
router.get('/cart_product', (req, res)=> {
    const sql = `select product_id, cart_product.quantity, name_product, description, price, avatar, users_id, category_product
                    from cart_product
                    join products on cart_product.product_id = products.id
                    join cart on cart_product.cart_id = cart.id
                    join category on products.category_id = category.id`
    console.log(sql)
    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
        
        res.send(results)
        console.log(results)
    })
})

router.delete('/cart_product/:id',(req,res)=>{
    const sql = `DELETE FROM cart_product WHERE product_id = ${req.params.id}`

    conn.query(sql,(err,results)=>{
        if(err){
            return res.send(err)
        }
        res.send(results)
    })
})


// patch cart_product into verified
// router.patch('/cart_productverified/:id',(req,res)=>{  
//     const data = req.body
//     const sql = `SELECT * FROM checkout WHERE id = ${req.params.id}`
//     const sql2 = `UPDATE cart_product SET checkout_verified = ${data.checkout_verified} WHERE cart_id = ${req.params.id}`
    

//     conn.query(sql, (err,results)=>{
//         if(err){
//             return res.send(err)
//         }
//         // cek ketersediaan produk, kalau lebih besar quantity produk ya eksekusi, kalau enggak ya kasih notif
//         // data.quantity di query ini merupakan hasil penjumlahan antara quantity yang dimasukin di cart_product ama yang ditambah
//         if(results[0].verified = true) {
//             conn.query(sql2,(err,results2)=>{
//                 if(err){
//                     return res.send(err)
//                 }
//                 res.send(results2)
//             })
//         } else {
           
//             return res.status(400).send('DILARANG MELEBIHI STOCK')
//         }     
        


//     })
// })

module.exports = router


