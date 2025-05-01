import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';


dotenv.config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });


const hashedPassword = '$2b$10$Oebz0ahQY7xHOWKt2a2JBeYbriPRzsPCaUqpr5Z5wYHhwg0p2Y49e';


const categories = ['General', 'Technology', 'Sports', 'Entertainment', 'Science', 'Politics', 'Art', 'Other'];


const userBios = [
  "Software developer with 5 years of experience",
  "Digital marketing specialist based in New York",
  "Passionate about technology and innovation",
  "Student studying Computer Science",
  "Professional photographer specializing in landscapes",
  "Graphic designer with a love for minimalist design",
  "Fitness instructor and nutrition coach",
  "Writer and blogger focusing on tech trends",
  "UX designer creating intuitive digital experiences",
  "Entrepreneur working on my third startup",
  "Teacher with 10 years of experience",
  "Machine learning engineer interested in AI ethics",
  "Cybersecurity specialist and ethical hacker",
  "Data analyst turning numbers into insights",
  "Product manager with a background in engineering"
];

const firstNames = ["James", "Robert", "John", "Michael", "William", "David", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Susan", "Sarah", "Jessica", "Emily", "Olivia", "Emma", "Ava", "Sophia", "Isabella", "Liam", "Noah", "Ethan", "Lucas", "Mason"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];


const postTitles = [
  "The Future of Artificial Intelligence in Healthcare",
  "10 Ways to Improve Your Productivity",
  "How Climate Change is Affecting Our Oceans",
  "The Rise of Remote Work: Benefits and Challenges",
  "Understanding Blockchain Technology",
  "The Impact of Social Media on Mental Health",
  "Exploring Space: Recent Discoveries and Future Missions",
  "Sustainable Living: Simple Changes with Big Impact",
  "The Evolution of Mobile Technology",
  "Cyber Security Best Practices for Small Businesses",
  "The Growing Importance of Data Privacy",
  "Virtual Reality: Beyond Gaming Applications",
  "Machine Learning: A Beginner's Guide",
  "The Psychology of Decision Making",
  "Renewable Energy Solutions for Homeowners"
];

const postContents = [
  "Artificial intelligence is transforming healthcare in numerous ways. From diagnostic tools that can detect diseases earlier than ever before to personalized treatment plans based on individual genetic profiles, AI is helping healthcare providers deliver better care. Machine learning algorithms can analyze vast amounts of medical data to identify patterns that might escape human detection. This technology is also streamlining administrative tasks, allowing healthcare professionals to spend more time with patients. As AI continues to advance, we can expect even more revolutionary changes in how healthcare is delivered and experienced.",
  
  "Productivity isn't just about working harder; it's about working smarter. Start by identifying your most productive hours and schedule your most challenging tasks during those times. Break large projects into smaller, manageable tasks to avoid feeling overwhelmed. Minimize distractions by turning off notifications and designating specific times for checking emails. Take regular breaks to maintain focus and prevent burnout. Use tools and apps designed to enhance productivity, such as task managers and time trackers. Finally, don't underestimate the importance of sleep, exercise, and proper nutrition in maintaining high levels of productivity.",
  
  "Climate change is having profound effects on our oceans. Rising sea temperatures are causing coral bleaching and disrupting marine ecosystems. Ocean acidification, caused by increased carbon dioxide absorption, is threatening shellfish and other marine organisms. Sea levels are rising, putting coastal communities at risk. Changes in ocean currents could alter weather patterns globally. Despite these concerning trends, there is hope. Conservation efforts, renewable energy adoption, and sustainable fishing practices can help mitigate these effects. It's crucial that we take action now to protect our oceans for future generations.",
  
  "The shift to remote work has been accelerated by recent global events, bringing both benefits and challenges. On the positive side, remote work offers flexibility, eliminates commuting time, and can lead to better work-life balance. Companies benefit from reduced office costs and access to a global talent pool. However, challenges include maintaining team cohesion, ensuring effective communication, and addressing potential isolation and burnout among remote workers. The most successful remote work arrangements combine clear expectations, regular check-ins, appropriate technology tools, and deliberate efforts to foster a positive company culture across distances."
];


const commentContents = [
  "This is exactly what I've been thinking! Great insights.",
  "I disagree with some points, but overall a well-written article.",
  "Could you provide more sources for these claims?",
  "This perspective changed how I think about the topic.",
  "I've shared this with my network - very valuable information.",
  "The point about sustainability particularly resonated with me.",
  "I'm curious how this applies in different cultural contexts.",
  "Have you considered the economic implications of this approach?",
  "This builds nicely on the research from last year's conference.",
  "As someone working in this field, I can confirm these trends.",
  "I'd love to see a follow-up piece exploring the ethical dimensions.",
  "The historical context provided really helps frame the issue.",
  "The practical tips at the end are especially helpful.",
  "I've implemented similar strategies with great results.",
  "This is particularly relevant given recent policy changes."
];


const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];


const getRandomPastDate = () => {
  const now = new Date();
  const pastDate = new Date(now.setMonth(now.getMonth() - Math.floor(Math.random() * 12)));
  return pastDate;
};


const getRandomDateBetween = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};


const seedDatabase = async () => {
  try {
    
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    
    console.log('Existing data cleared');

    
    const adminUsers = [];
    for (let i = 0; i < 3; i++) {
      const admin = await User.create({
        username: `admin${i+1}`,
        email: `admin${i+1}@example.com`,
        password: hashedPassword, 
        isAdmin: true,
        bio: getRandomItem(userBios),
        avatar: `admin${i+1}.jpg`
      });
      adminUsers.push(admin);
    }
    console.log('Admin users created');

    
    const regularUsers = [];
    for (let i = 0; i < 50; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}`;
      
      const user = await User.create({
        username: username,
        email: `${username}@example.com`,
        password: hashedPassword, 
        bio: getRandomItem(userBios),
        avatar: `user${i+1}.jpg`
      });
      regularUsers.push(user);
    }
    console.log('Regular users created');

    
    const allUsers = [...adminUsers, ...regularUsers];

    
    const posts = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const postTitle = postTitles[i % postTitles.length] + (Math.floor(i / postTitles.length) > 0 ? ` - Part ${Math.floor(i / postTitles.length) + 1}` : '');
      const randomContent = getRandomItem(postContents);
      
      const post = await Post.create({
        title: postTitle,
        content: randomContent,
        author: randomUser._id,
        category: categories[Math.floor(Math.random() * categories.length)],
        createdAt: getRandomPastDate(),
      });
      
      
      const shuffledUsers = [...allUsers].sort(() => 0.5 - Math.random());
      const upvoteCount = Math.floor(Math.random() * 10);
      const downvoteCount = Math.floor(Math.random() * 5);
      
      const upvoters = shuffledUsers.slice(0, upvoteCount);
      const downvoters = shuffledUsers.slice(upvoteCount, upvoteCount + downvoteCount);
      
      post.upvotes = upvoters.map(user => user._id);
      post.downvotes = downvoters.map(user => user._id);
      post.score = post.upvotes.length - post.downvotes.length;
      await post.save();
      
      posts.push(post);
    }
    console.log('Posts created');

    
    for (let i = 0; i < 300; i++) {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomPost = posts[Math.floor(Math.random() * posts.length)];
      
      const comment = await Comment.create({
        content: getRandomItem(commentContents),
        author: randomUser._id,
        post: randomPost._id,
        createdAt: getRandomDateBetween(randomPost.createdAt, new Date()),
      });
      
      
      const shuffledUsers = [...allUsers].sort(() => 0.5 - Math.random());
      const upvoteCount = Math.floor(Math.random() * 5);
      const downvoteCount = Math.floor(Math.random() * 2);
      
      const upvoters = shuffledUsers.slice(0, upvoteCount);
      const downvoters = shuffledUsers.slice(upvoteCount, upvoteCount + downvoteCount);
      
      comment.upvotes = upvoters.map(user => user._id);
      comment.downvotes = downvoters.map(user => user._id);
      comment.score = comment.upvotes.length - comment.downvotes.length;
      await comment.save();
    }
    console.log('Comments created');

    
    const comments = await Comment.find();
    for (let i = 0; i < 150; i++) {
      if (comments.length === 0) break;
      
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const randomComment = comments[Math.floor(Math.random() * comments.length)];
      
      const reply = await Comment.create({
        content: `In response to the comment: ${getRandomItem(commentContents)}`,
        author: randomUser._id,
        post: randomComment.post,
        parentComment: randomComment._id,
        createdAt: getRandomDateBetween(randomComment.createdAt, new Date()),
      });
      
      
      const shuffledUsers = [...allUsers].sort(() => 0.5 - Math.random());
      const upvoteCount = Math.floor(Math.random() * 3);
      
      const upvoters = shuffledUsers.slice(0, upvoteCount);
      
      reply.upvotes = upvoters.map(user => user._id);
      reply.score = reply.upvotes.length;
      await reply.save();
    }
    console.log('Comment replies created');

    console.log('Database seeding completed!');
    console.log(`Created:
    - 3 Admin users
    - 50 Regular users
    - 100 Posts
    - 300 Comments
    - 150 Comment replies`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 