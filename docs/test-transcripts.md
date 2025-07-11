# Test Transcripts for Meeting Summarizer Agent

## Sample 1: Weekly Team Meeting

```
John (Project Manager): Good morning everyone, let's start our weekly team meeting. Sarah, can you give us an update on the Q4 project timeline?

Sarah (Developer): Thanks John. We're currently on track with the main features. The authentication system is complete, and we're 80% done with the payment integration. However, we've hit a roadblock with the third-party API integration.

Mike (Backend Developer): I've been working on that API issue. The documentation was outdated, so I had to reverse engineer some endpoints. It's taking longer than expected.

John: How much longer do you think it will take?

Mike: Probably another week. The good news is once we get this working, the rest should be straightforward.

Sarah: That's going to push our deadline back by at least a week. Should we inform the client?

John: Yes, let's be proactive about this. Sarah, can you draft an email to the client explaining the delay and our plan to catch up?

Sarah: Absolutely, I'll send that by end of day.

Mike: I'll also create a detailed technical report for the client explaining what we discovered.

John: Perfect. Now, let's talk about the upcoming sprint. We need to prioritize the remaining features.

Sarah: I think we should focus on the user dashboard first, then the reporting module.

Mike: I agree. The dashboard is more critical for the MVP.

John: Sounds good. Sarah, can you update the project plan with the new timeline?

Sarah: Will do. I'll have that ready by Friday.

John: Great. Any other issues or concerns?

Mike: Just one thing - we might need to upgrade our server capacity for the payment processing.

John: I'll look into that this week. Thanks everyone, that's all for today.
```

## Sample 2: Product Planning Meeting

```
Alice (Product Manager): Welcome to our Q1 product planning session. Today we need to decide on our roadmap for the next quarter. Let's start with the mobile app features.


Charlie (Mobile Developer): Dark mode is straightforward to implement. Push notifications will require backend changes and Apple/Google approval. Offline sync is the most complex - we'll need to redesign our data architecture.

Alice: How long would each feature take?

Charlie: Dark mode - 1 week. Push notifications - 3 weeks including approval time. Offline sync - 6-8 weeks.

Bob: I think we should prioritize dark mode first since it's quick and has high user demand.

Alice: I agree. What about the web platform features?

David (Frontend Developer): We need to improve the dashboard performance. Users are complaining about slow load times.

Emma (Backend Developer): I can optimize the API endpoints. That should reduce load times by 60-70%.

Alice: How long will that take?

Emma: About 2 weeks for the optimizations, plus testing.

Alice: Perfect. Let's prioritize: 1) Dark mode, 2) API optimizations, 3) Push notifications. We'll tackle offline sync in Q2.

Bob: Should we also plan for the new analytics dashboard?

Alice: Yes, but let's keep it simple for Q1. We can add basic charts and user metrics.

David: I can start working on the analytics framework next week.

Alice: Great. Any budget concerns?

Emma: We might need to upgrade our database plan for the analytics features.

Alice: I'll check with finance about the budget allocation. Any other items?

Charlie: Just a reminder that we need to plan for the iOS 17 compatibility update.

Alice: Good point. Let's add that to the Q1 list. Thanks everyone!
```

## Sample 3: Client Meeting

```
Client (Sarah Johnson): Hi everyone, thanks for joining us today. We're excited to see the progress on our e-commerce platform.

Project Manager (Alex): Thank you for your time, Sarah. We've made significant progress since our last meeting. Let me walk you through the current status.

Developer (Maria): We've completed the user registration and login system. The product catalog is fully functional, and we're 90% done with the shopping cart.

Client: That's great! When can we start testing?

Alex: We're planning to have a beta version ready by next Friday. You'll be able to test the full user journey.

Client: Perfect. What about the payment integration?

Developer (Tom): We've integrated with Stripe for credit card payments. We're also adding PayPal as an option.

Client: Excellent. What about the admin panel for managing products?

Maria: The admin panel is about 70% complete. You'll be able to add products, manage inventory, and view orders.

Client: Can we customize the product categories?

Alex: Yes, the admin panel includes category management. You can create, edit, and organize categories as needed.

Client: What about reporting and analytics?

Tom: We're implementing basic sales reports and customer analytics. You'll be able to track sales, popular products, and customer behavior.

Client: That sounds comprehensive. What's the timeline for launch?

Alex: If testing goes well, we're targeting March 15th for the soft launch. We'll start with a small group of customers.

Client: That works for us. Do we need to prepare anything on our end?

Maria: You'll need to set up your Stripe account and provide product images and descriptions.

Client: No problem. We can have that ready by next week.

Alex: Perfect. We'll send you the beta access details by Friday. Any other questions?

Client: Just one - can we integrate with our existing inventory system?

Tom: We can definitely do that. We'll need to see your current system's API documentation.

Client: I'll have our IT team provide that information.

Alex: Great. Thanks everyone for your time today.
```

## Sample 4: Technical Architecture Review

```
Lead Architect (Dr. Chen): Welcome to our technical architecture review. Today we're discussing the scalability challenges we've identified.

Senior Developer (Lisa): We've been monitoring our system performance and found several bottlenecks. The main issue is our database queries are taking too long under load.

DevOps Engineer (Mark): I've analyzed the infrastructure. We're hitting CPU limits on our application servers during peak hours.

Lisa: The problem is we're doing too many database calls per request. We need to implement caching.

Mark: I agree. Redis would be perfect for this. We can cache frequently accessed data and reduce database load by 70-80%.

Dr. Chen: What's the implementation timeline?

Lisa: About 2 weeks to implement Redis caching. Another week for testing and optimization.

Mark: We should also consider database read replicas for better performance.

Lisa: Good point. That would require about 3 weeks of work.

Dr. Chen: What about the frontend performance issues?

Frontend Developer (Jake): The main issue is large bundle sizes. We're loading too much JavaScript upfront.

Jake: I recommend implementing code splitting and lazy loading. That should reduce initial load time by 40%.

Dr. Chen: How long will that take?

Jake: About 1 week for the refactoring.

Dr. Chen: Let's prioritize: 1) Redis caching, 2) Code splitting, 3) Database replicas. What's the budget impact?

Mark: Redis will cost about $200/month. Database replicas will add $500/month to our infrastructure costs.

Dr. Chen: That's reasonable given the performance improvements. Any security concerns?

Security Engineer (Rachel): We need to ensure Redis is properly secured. I recommend implementing authentication and encryption.

Mark: I'll work with Rachel on the security configuration.

Dr. Chen: Perfect. Let's start with Redis caching next week. Any other concerns?

Lisa: Just one - we should plan for monitoring and alerting for the new infrastructure.

Mark: I'll set up monitoring for Redis and the new database replicas.

Dr. Chen: Excellent. Thanks everyone for the detailed analysis.
```

## Sample 5: Crisis Management Meeting

```
CEO (Jennifer): Thank you everyone for joining this urgent meeting. We have a critical issue with our payment system that's affecting customer transactions.

CTO (Robert): We discovered the issue about an hour ago. The payment gateway is returning errors for about 30% of transactions.

Lead Developer (Amanda): I've identified the root cause. There's a bug in our payment validation logic that's rejecting valid credit card numbers.

Robert: How quickly can we fix this?

Amanda: I can have a hotfix ready in 2 hours. We need to update the validation rules and deploy to production.

Customer Support (David): We're getting flooded with support tickets. Customers are frustrated and some are threatening to cancel their subscriptions.

Jennifer: This is a top priority. Amanda, please focus on the fix. David, can you prepare a customer communication plan?

David: I'll draft an email to affected customers explaining the issue and our timeline for resolution.

Marketing (Sarah): Should we post something on social media to address the concerns?

Jennifer: Yes, but let's be transparent about the issue and our response time.

Robert: I'll coordinate with the DevOps team to ensure a smooth deployment.

Amanda: I'll also add additional logging so we can monitor the fix in real-time.

Jennifer: What's our backup plan if the fix doesn't work?

Robert: We can temporarily disable the problematic validation and rely on the payment gateway's built-in validation.

Amanda: That's a good fallback, but it's less secure. Let's try the proper fix first.

Jennifer: Agreed. Let's have another meeting in 3 hours to check the status. David, please keep me updated on customer feedback.

David: Will do. I'll also prepare a FAQ for the support team.

Jennifer: Perfect. Let's get this resolved quickly. Thanks everyone.
```

## Usage Instructions

1. **Copy any transcript** from above
2. **Paste it** into the Meeting Summarizer Agent
3. **Select your model** (phi4:latest or deepseek-r1:14b)
4. **Click "Generate Summary"**
5. **Review the structured results**

## Expected Results

Each transcript should generate:
- **Summary**: Concise overview of the meeting
- **Action Items**: Tasks with assignees and priorities
- **Decisions**: Key decisions made during the meeting
- **Key Points**: Important topics discussed
- **Speaker Sentiments**: Emotional tone analysis (if enabled)

## Tips for Best Results

1. **Use clear speaker names** in the format "Name: Message"
2. **Include context** about roles or departments
3. **Test with different models** to see which works best
4. **Try both with and without sentiment analysis**
5. **Compare results** between phi4:latest and deepseek-r1:14b 

## Update the webpack.config.js file

Replace the content of your `webpack.config.js` file with this:

```javascript
const path = require('path');

module.exports = {
  devServer: {
    allowedHosts: ['localhost', '.localhost'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
};
```

## Alternative: Try the .env approach

If that doesn't work, delete the `webpack.config.js` file and create a `.env` file in the frontend directory with:

```
HOST=localhost
PORT=3000
CHOKIDAR_USEPOLLING=true
```

## Or try this command

If neither works, try:

```powershell
npm start -- --host 0.0.0.0
```

Try the updated webpack config first, then run `npm start` again. Let me know which approach works! 