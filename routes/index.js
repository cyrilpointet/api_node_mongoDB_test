import express from 'express';
const router = express.Router();
import index from '../resources/html/index.html';

router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/" + index);
  //res.json({})
});

export default router;
