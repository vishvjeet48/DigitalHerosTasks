import { Router } from 'express';
import {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createLeadSchema,
  updateLeadStatusSchema,
} from '../validators/lead.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', validate(createLeadSchema), createLead);
router.get('/export', protect, exportLeads);
router.get('/', protect, getLeads);
router.patch('/:id/status', protect, validate(updateLeadStatusSchema), updateLeadStatus);
router.delete('/:id', protect, deleteLead);

export default router;

