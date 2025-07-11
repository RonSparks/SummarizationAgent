// Sample emails for Email Classification
const emailSamples = [
    {
        emailBody: "Hi team, I need this report completed by end of day today. This is critical for our client presentation tomorrow morning. Please let me know if you need any clarification.",
        emailMetadata: "From: manager@company.com, Subject: URGENT - Report needed today, Time: 2:30 PM"
    },
    {
        emailBody: "Just wanted to let everyone know that the office will be closed next Friday for the holiday. We'll reopen on Monday. Have a great weekend!",
        emailMetadata: "From: hr@company.com, Subject: Office Closure Notice, Time: 10:15 AM"
    },
    {
        emailBody: "Can you please review the attached proposal and provide feedback by Friday? I'd like to submit it to the client next week. Thanks!",
        emailMetadata: "From: colleague@company.com, Subject: Proposal Review Request, Time: 3:45 PM"
    },
    {
        emailBody: "CONGRATULATIONS! You've won a FREE iPhone 15! Click here to claim your prize now! Limited time offer! Don't miss out!",
        emailMetadata: "From: winner@prize.com, Subject: YOU'RE A WINNER!, Time: 1:20 AM"
    },
    {
        emailBody: "Hi, I'd like to schedule a meeting to discuss the Q3 project timeline. Are you available tomorrow at 2 PM or Thursday at 10 AM? Let me know what works best for you.",
        emailMetadata: "From: client@external.com, Subject: Meeting Request - Q3 Timeline, Time: 11:30 AM"
    },
    {
        emailBody: "Thanks for the quick response yesterday. I've updated the document with your suggestions and attached it here. Let me know if you need any other changes.",
        emailMetadata: "From: team@company.com, Subject: Re: Document Updates, Time: 9:00 AM"
    },
    {
        emailBody: "This week's newsletter includes: New product launch announcement, Team member spotlight, Upcoming events, and Industry insights. Read more on our website!",
        emailMetadata: "From: newsletter@company.com, Subject: Weekly Newsletter - Issue #45, Time: 8:00 AM"
    },
    {
        emailBody: "The server is experiencing technical difficulties. Our IT team is working on the issue and expects to have it resolved within the next hour. We apologize for any inconvenience.",
        emailMetadata: "From: it@company.com, Subject: System Maintenance Notice, Time: 4:15 PM"
    }
];

function loadRandomEmailSample() {
    const randomIndex = Math.floor(Math.random() * emailSamples.length);
    const sample = emailSamples[randomIndex];
    
    document.getElementById('emailBody').value = sample.emailBody;
    document.getElementById('emailMetadata').value = sample.emailMetadata;
} 