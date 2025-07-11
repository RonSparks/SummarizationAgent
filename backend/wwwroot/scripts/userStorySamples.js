// Sample conversations for User Story creation
const userStorySamples = [
    {
        inputText: "We need to add a login feature to our mobile app. Users should be able to sign in with their email and password, and we should also support social login with Google and Facebook. The login should be secure and we need to implement password reset functionality.",
        projectContext: "Mobile banking application with user authentication requirements"
    },
    {
        inputText: "The customer support team is having trouble tracking customer issues. They need a dashboard where they can see all open tickets, filter by priority and status, and update ticket status. They also want to be able to assign tickets to different team members and add notes to tickets.",
        projectContext: "Customer support ticketing system for a SaaS platform"
    },
    {
        inputText: "Our e-commerce site needs a shopping cart feature. Users should be able to add products to cart, view cart contents, update quantities, remove items, and proceed to checkout. The cart should persist between sessions and show shipping costs.",
        projectContext: "E-commerce website with shopping cart functionality"
    },
    {
        inputText: "The marketing team wants to send automated email campaigns. They need to create email templates, set up email lists, schedule campaigns, and track open rates and click-through rates. They also want A/B testing capabilities.",
        projectContext: "Marketing automation platform with email campaign features"
    },
    {
        inputText: "We need to implement a real-time chat feature for our collaboration tool. Users should be able to create channels, send messages, share files, and get notifications for mentions. The chat should support emojis and message threading.",
        projectContext: "Team collaboration platform with real-time messaging"
    }
];

function loadRandomUserStorySample() {
    const randomIndex = Math.floor(Math.random() * userStorySamples.length);
    const sample = userStorySamples[randomIndex];
    
    document.getElementById('inputText').value = sample.inputText;
    document.getElementById('projectContext').value = sample.projectContext;
} 