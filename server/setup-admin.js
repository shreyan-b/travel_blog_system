import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

async function setup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    // --- Step 1: Show all users and let you pick an admin ---
    const users = await User.find().select('username email role isSuspended');
    console.log("📋 All registered users:");
    users.forEach((u, i) => {
      console.log(`  ${i + 1}. ${u.username} (${u.email}) - role: ${u.role || 'user'}`);
    });

    // Make the FIRST user an admin (change the email below if needed)
    if (users.length > 0) {
      const adminEmail = users[0].email; // <-- Change this if you want a different user as admin
      const result = await User.updateOne(
        { email: adminEmail },
        { $set: { role: 'admin' } }
      );
      console.log(`\n✅ Set "${adminEmail}" as admin (matched: ${result.matchedCount}, modified: ${result.modifiedCount})`);
    } else {
      console.log("\n⚠️  No users found. Sign up first, then run this script again.");
    }

    // --- Step 2: Mark all existing posts as approved ---
    const postResult = await Post.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'approved' } }
    );
    const postResult2 = await Post.updateMany(
      { status: null },
      { $set: { status: 'approved' } }
    );
    console.log(`\n✅ Marked ${postResult.modifiedCount + postResult2.modifiedCount} existing posts as "approved"`);

    // Show summary
    const pendingCount = await Post.countDocuments({ status: 'pending' });
    const approvedCount = await Post.countDocuments({ status: 'approved' });
    console.log(`\n📊 Post status summary:`);
    console.log(`   Pending:  ${pendingCount}`);
    console.log(`   Approved: ${approvedCount}`);

    console.log("\n🎉 Setup complete! You can now log in as admin.");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

setup();
