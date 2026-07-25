import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead.js';
import { AppError } from '../utils/AppError.js';
import { CreateLeadInput, UpdateLeadStatusInput } from '../validators/lead.validator.js';

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leadData = req.body as CreateLeadInput;
    const lead = await Lead.create(leadData);

    res.status(201).json({
      success: true,
      message: 'Lead submitted successfully',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const search = (req.query.search as string)?.trim() || '';
    const status = (req.query.status as string)?.trim() || '';
    const sort = (req.query.sort as string) || 'newest';

    const filter: Record<string, unknown> = {};

    if (status && ['New', 'Contacted', 'Closed'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { budget: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { status: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const skip = (page - 1) * limit;

    const [leads, total, stats] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
      Lead.countDocuments(filter),
      Lead.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts = {
      total: 0,
      New: 0,
      Contacted: 0,
      Closed: 0,
    };

    for (const item of stats) {
      statusCounts[item._id as keyof typeof statusCounts] = item.count;
      statusCounts.total += item.count;
    }

    res.status(200).json({
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        stats: statusCounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body as UpdateLeadStatusInput;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: { lead },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

export const exportLeads = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    const header = 'ID,Name,Email,Budget,Status,Message,Created At\n';
    const csvRows = leads.map((l) => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        l._id,
        escape(l.name),
        escape(l.email),
        escape(l.budget),
        escape(l.status),
        escape((l.message || '').replace(/\n/g, ' ')),
        l.createdAt ? l.createdAt.toISOString() : '',
      ].join(',');
    });

    const csvContent = header + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

