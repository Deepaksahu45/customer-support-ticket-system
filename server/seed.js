// Aegis — Seed script for development data
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Message = require('./models/Message');
const Counter = require('./models/Counter');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🛡️  Aegis — Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Message.deleteMany({});
    await Counter.deleteMany({});

    // Initialize counter
    await Counter.create({ name: 'ticketId', value: 1000 });

    // Create users
    const admin = await User.create({
      name: 'Aegis Admin',
      email: 'admin@aegis.com',
      password: 'admin123',
      role: 'admin',
    });

    const agent = await User.create({
      name: 'Aegis Agent',
      email: 'agent@aegis.com',
      password: 'agent123',
      role: 'agent',
    });

    const customer = await User.create({
      name: 'John Customer',
      email: 'customer@aegis.com',
      password: 'customer123',
      role: 'customer',
    });

    console.log('👤 Aegis — Users seeded');

    // Create tickets
    const ticket1 = await Ticket.create({
      title: 'Cannot login to my account',
      description:
        'I have been trying to login to my account since yesterday but I keep getting an "Invalid credentials" error. I have tried resetting my password but the reset email never arrives. My account email is john@example.com. Please help urgently.',
      priority: 'high',
      status: 'open',
      category: 'technical',
      createdBy: customer._id,
      tags: ['login', 'authentication', 'password-reset'],
    });

    const ticket2 = await Ticket.create({
      title: 'Wrong amount charged on invoice',
      description:
        'My latest invoice #INV-2024-0892 shows a charge of $149.99 but my plan is the Growth plan at $29/month. It seems I was charged for 5 months at once without any notification. I need a refund for the overcharged amount of $119.99.',
      priority: 'urgent',
      status: 'in-progress',
      category: 'billing',
      createdBy: customer._id,
      assignedTo: agent._id,
      tags: ['billing', 'overcharge', 'refund'],
    });

    const ticket3 = await Ticket.create({
      title: 'How do I export my data?',
      description:
        'I would like to export all my ticket history and conversation data as a CSV file. Is this feature available? If so, where can I find the export option? I checked the settings page but could not find anything related to data export.',
      priority: 'low',
      status: 'resolved',
      category: 'general',
      createdBy: customer._id,
      assignedTo: agent._id,
      resolvedAt: new Date(),
      tags: ['export', 'data', 'feature-request'],
    });

    console.log('🎫 Aegis — Tickets seeded');

    // Create messages for ticket 1
    await Message.create([
      {
        ticketId: ticket1._id,
        sender: customer._id,
        content:
          'Hi, I cannot login to my account. I keep getting an "Invalid credentials" error even though I am sure my password is correct.',
        createdAt: new Date(Date.now() - 3600000 * 3),
      },
      {
        ticketId: ticket1._id,
        sender: agent._id,
        content:
          'Hello John! I am sorry to hear you are having trouble logging in. Let me check your account status. Could you confirm the email address associated with your account?',
        createdAt: new Date(Date.now() - 3600000 * 2.5),
      },
      {
        ticketId: ticket1._id,
        sender: customer._id,
        content:
          'Yes, my email is john@example.com. I also tried the password reset but never received the email.',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
    ]);

    // Create messages for ticket 2
    await Message.create([
      {
        ticketId: ticket2._id,
        sender: customer._id,
        content:
          'I just noticed my invoice shows $149.99 instead of $29. This is a huge overcharge! I need this resolved ASAP.',
        createdAt: new Date(Date.now() - 7200000 * 3),
      },
      {
        ticketId: ticket2._id,
        sender: agent._id,
        content:
          'I understand your concern, John. I have escalated this to our billing department. We can see the discrepancy in the system. A refund of $119.99 will be processed within 3-5 business days.',
        createdAt: new Date(Date.now() - 7200000 * 2),
      },
      {
        ticketId: ticket2._id,
        sender: customer._id,
        content: 'Thank you for the quick response. I will keep an eye on my account for the refund.',
        createdAt: new Date(Date.now() - 7200000),
      },
      {
        ticketId: ticket2._id,
        sender: agent._id,
        content:
          'You are welcome! I have also added a note to ensure this does not happen again. Is there anything else I can help with?',
        createdAt: new Date(Date.now() - 3600000),
      },
    ]);

    // Create messages for ticket 3
    await Message.create([
      {
        ticketId: ticket3._id,
        sender: customer._id,
        content:
          'Is there a way to export my ticket history as CSV? I checked settings but could not find it.',
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        ticketId: ticket3._id,
        sender: agent._id,
        content:
          'Great question! You can export your data by going to Settings → Data Management → Export. Choose "Tickets" as the data type and select CSV format. The export will be emailed to your registered address.',
        createdAt: new Date(Date.now() - 86400000),
      },
      {
        ticketId: ticket3._id,
        sender: customer._id,
        content: 'Found it! Thank you so much. You can close this ticket.',
        createdAt: new Date(Date.now() - 43200000),
      },
    ]);

    console.log('💬 Aegis — Messages seeded');

    console.log('\n🛡️  Aegis database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Demo Accounts:');
    console.log('  Admin:    admin@aegis.com    / admin123');
    console.log('  Agent:    agent@aegis.com    / agent123');
    console.log('  Customer: customer@aegis.com / customer123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Aegis seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
