const conn = require('../connection/index')
const router = require('express').Router()


router.post('/admin/login', (req, res) => {
   const sql = `SELECT * FROM admin WHERE email = '${req.body.email}' AND
                password = '${req.body.password}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result[0])
   })
})




module.exports = router