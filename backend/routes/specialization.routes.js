const express = require('express');
const router = express.Router();
const specializationController = require('../curriculum/specialty/specialization.controller');
const skillController = require('../curriculum/specialty/skill.controller');

// Specialization CRUD
router.post('/create', specializationController.createSpecialization);
router.get('/view', specializationController.getAllSpecializations);
router.put('/:id', specializationController.updateSpecialization);
router.delete('/deleteAll', specializationController.deleteAllSpecializations);
router.delete('/:id', specializationController.deleteSpecialization);

// Skill CRUD (nested under specialization)
router.post('/skill/create', skillController.createSkill);
router.get('/skill/view', skillController.getAllSkills);

module.exports = router;
