const conn = require('../connection/index')
const router = require('express').Router()


router.post('/admin/login', (req, res) => {
   const sql = `SELECT * FROM admin WHERE username = '${req.body.username}' AND
                password = '${req.body.password}'`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result[0])
   })
})

router.post('/admin', (req, res) => {
   const sql = `INSERT INTO admin SET = ?`
   const data = req.body

   conn.query(sql, data, (err, result) => {
      if (err) res.send(err)

      res.send(result)
   })
})

router.get('/admin', (req, res) => {
   const sql = `SELECT * FROM admin`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})

router.delete('/admin/:id', (req, res) => {
   const sql = `DELETE FROM admin WHERE id = ${req.params.id}`

   conn.query(sql, (err, result) => {
      if (err) return res.send(err)

      res.send(result)
   })
})


module.exports = router