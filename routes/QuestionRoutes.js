var express = require('express');
var router = express.Router();
var QuestionController = require('../controllers/QuestionController.js');

/*
 * GET
 */
router.get('/', QuestionController.list);

/*
 * GET
 */
router.get('/:id', QuestionController.show);

/*
 * POST
 */
router.post('/', QuestionController.create);

/*
 * PUT
 */
router.put('/:id', QuestionController.update);

/*
 * DELETE
 */
router.delete('/:id', QuestionController.remove);

module.exports = router;
