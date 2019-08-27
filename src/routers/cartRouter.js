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

    conn.query(sql, (err,results)=>{
        if(err){
            return res.send(err)
        }
    

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
           
            return res.send(`Dilarang melebihi : ${results[0].quantity}`)
        }     
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