const express = require('express')
const cors = require('cors')
const powrt = require('./config/port')

const userRouter = require('./routers/userRouter')
const productRouter = require('./routers/productRouter')
const cartRouter = require('./routers/cartRouter')

const app = express()
const port = powrt



app.use(express.json())
app.use(cors())
app.use(userRouter)
app.use(productRouter)
app.use(cartRouter)
//app.use(taskRouter)

app.get('/', (req, res) => {
    res.send('Selamat Datang Brok!!')
})

app.listen(port, () => {
    console.log('Berhasil Running di ' + port);
    
})

