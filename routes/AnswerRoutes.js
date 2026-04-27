var express = require('express');
var router = express.Router();
var AnswerController = require('../controllers/AnswerController.js');

/*
 * GET
 */
router.get('/', AnswerController.list);

/*
 * GET
 */
router.get('/:id', AnswerController.show);

/*
 * POST
 */
router.post('/', AnswerController.create);

/*
 * PUT
 */
router.put('/:id', AnswerController.update);

/*
 * DELETE
 */
router.delete('/:id', AnswerController.remove);

module.exports = router;
