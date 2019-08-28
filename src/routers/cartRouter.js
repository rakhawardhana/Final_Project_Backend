const conn = require('../connection/index')
const router = require('express').Router()



// cek jumlah quantity product di tabel product 
    // kalau memang quantity product < quantity yang dipesan di body, kasih notif
// cek dulu di cart product, itu ada yang product_idnya sama ga
    // kalau sama, cek dulu quantity yang udah diminta + 
        //quantity yang dipesan lebih besar dari quantity produk apa enggak, 
        //kalau lebih besar, kasih notif kagak ada stok, kalau lebih kecil, eksekusi tambah 
    // kalau beda, yaudah ditambah product_idnya 
    





router.post('/cart_product',(req,res)=>{

    const data = req.body
    const sql = `SELECT * FROM products WHERE id = ${data.product_id}`
    const sql2 = `INSERT INTO cart_product SET ?`
    const sql3 = `select * from cart where users_id = ${data.id}`
    // const cart_productdata = {
        
    //     product_id : data.product_id,
    //     quantity : data.quantity,
        
    // }
    console.log(sql)
    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
    
        console.log(results)
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

    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
        
        res.send(results[0])
    })
})



router.patch('/cart_product/:id',(req,res)=>{  

    const sql = `SELECT * FROM products WHERE id = ${req.params.id}`
    const sql2 = `UPDATE cart_product SET quantity = ${data.quantity} WHERE product_id = ${req.params.id}`
    const data = req.body

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
           
            return res.send(`Dilarang melebihi : ${results[0].quantity}`)
        }     
        


    })
})

module.exports = router