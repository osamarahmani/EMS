import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import User from './models/User.js';
import Employee from './models/Employee.js';
import Project from './models/Project.js';
import LeaveRequest from './models/LeaveRequest.js';
import CheckIn from './models/CheckIn.js';
import Notification from './models/Notification.js';
import ChatMessage from './models/ChatMessage.js';

dotenv.config();

const usersData = [
  { name: 'Ava Chen', email: 'admin@ems.com', password: 'password123', role: 'super_admin' },
  { name: 'Mina Patel', email: 'hr@ems.com', password: 'password123', role: 'hr' },
  { name: 'Leo Brooks', email: 'employee@ems.com', password: 'password123', role: 'employee' }
];

const employeesData = [
  { name: 'Alicia Stone', role: 'Product Designer', department: 'Design', status: 'Active' },
  { name: 'Daniel Kim', role: 'Engineering Lead', department: 'Engineering', status: 'Active' },
  { name: 'Nadia Flores', role: 'HR Partner', department: 'People Ops', status: 'Pending' },
  { name: 'Sanjay Rao', role: 'Finance Controller', department: 'Finance', status: 'Active' }
];

const leaveData = [
  { name: 'Rina Shah', type: 'Sick leave', status: 'Pending', reason: 'Fever' },
  { name: 'Tom Lewis', type: 'Casual leave', status: 'Approved', reason: 'Family function' }
];

const projectsData = [
  { name: 'Northwind rollout', progress: '82%', summary: 'Coordinate implementation with finance and operations.', owner: 'Anika', deadline: '2026-07-15', budget: '$180k' },
  { name: 'Global onboarding revamp', progress: '64%', summary: 'Streamline new-hire documentation and access provisioning.', owner: 'Mina', deadline: '2026-08-02', budget: '$96k' }
];

const notificationsData = [
  { title: 'Leave approval requested', time: '2m ago' },
  { title: 'New interview scheduled', time: '15m ago' },
  { title: 'Payroll batch released', time: '31m ago' }
];

const chatMessagesData = [
  { sender: 'Priya', text: 'Shared onboarding checklist', time: '10:00' },
  { sender: 'Jon', text: 'Updated sprint milestone', time: '10:02' },
  { sender: 'Ravi', text: 'Mentioned the payroll review', time: '10:05' }
];

async function seedData() {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Employee.deleteMany(),
      Project.deleteMany(),
      LeaveRequest.deleteMany(),
      CheckIn.deleteMany(),
      Notification.deleteMany(),
      ChatMessage.deleteMany()
    ]);

    console.log('Inserting seed data...');
    const insertedUsers = await User.insertMany(usersData);
    
    // Assign some users to employees
    const empsWithUserId = employeesData.map((emp, idx) => ({
      ...emp,
      userId: insertedUsers[idx % insertedUsers.length]._id
    }));
    await Employee.insertMany(empsWithUserId);

    await LeaveRequest.insertMany(leaveData);
    await Project.insertMany(projectsData);
    await Notification.insertMany(notificationsData);
    await ChatMessage.insertMany(chatMessagesData);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedData();
