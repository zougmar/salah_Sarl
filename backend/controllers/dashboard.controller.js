import Task from '../models/Task.model.js';
import User from '../models/User.model.js';
import Location from '../models/Location.model.js';

export const getStats = async (req, res) => {
  try {
    // Only admins can access dashboard stats
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Get total counts
    const total = await Task.countDocuments();
    const completed = await Task.countDocuments({ status: 'completed' });
    const inProgress = await Task.countDocuments({ status: 'in-progress' });
    const open = await Task.countDocuments({ status: 'open' });

    // Get overdue tasks (dueDate is in the past and status is not completed)
    const now = new Date();
    const overdue = await Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: 'completed' },
    });

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Get tasks per employee
    const tasksPerEmployee = await Task.aggregate([
      {
        $match: { assignee: { $ne: null } },
      },
      {
        $group: {
          _id: '$assignee',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      {
        $unwind: '$employee',
      },
      {
        $project: {
          _id: '$employee._id',
          name: '$employee.name',
          email: '$employee.email',
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get upcoming deadlines (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingDeadlines = await Task.find({
      dueDate: {
        $gte: now,
        $lte: sevenDaysFromNow,
      },
      status: { $ne: 'completed' },
    })
      .populate('assignee', 'name email')
      .sort({ dueDate: 1 })
      .limit(10);
      
    // Get recent locations (last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const recentLocations = await Location.find({
      createdAt: { $gte: twentyFourHoursAgo }
    })
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
      
    // Get total locations count
    const totalLocations = await Location.countDocuments();

    res.json({
      totals: {
        total,
        completed,
        inProgress,
        open,
        overdue,
      },
      users: {
        total: totalUsers,
        employees: totalEmployees,
        admins: totalAdmins,
      },
      locations: {
        total: totalLocations,
        recent: recentLocations,
      },
      tasksPerEmployee,
      upcomingDeadlines,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

