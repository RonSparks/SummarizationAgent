let currentResult = null;
let currentUserStoryResult = null;

// Debug: Check if script is loading
console.log('AI Agent Hub JavaScript loaded successfully');

// Fetch available models on page load
window.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing application...');
    
    // Set up event listeners for Ollama URL management buttons
    setupOllamaUrlEventListeners();
    
    await loadCurrentOllamaUrl();
    await fetchModels();
    await fetchUserStoryModels();
    await fetchEmailModels();
    console.log('Application initialization complete');
});

function setupOllamaUrlEventListeners() {
    // Add event listeners for Ollama URL management buttons
    const updateBtn = document.getElementById('updateOllamaBtn');
    const resetBtn = document.getElementById('resetOllamaBtn');
    const refreshBtn = document.getElementById('refreshModelsBtn');
    
    if (updateBtn) {
        updateBtn.addEventListener('click', updateOllamaUrl);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetOllamaUrl);
    }
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshAllModels);
    }
    
    console.log('Ollama URL event listeners set up');
}

async function fetchModels() {
    try {
        const response = await fetch('/api/summarization/models');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const models = await response.json();
        
        const select = document.getElementById('modelSelect');
        select.innerHTML = '';
        
        if (models.length === 0) {
            select.innerHTML = '<option value="">No models available</option>';
        } else {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                select.appendChild(option);
            });
        }
        
        console.log(`Loaded ${models.length} models for summarization agent`);
    } catch (error) {
        console.error('Error fetching summarization models:', error);
        showError('Failed to fetch available models. Make sure Ollama is running and accessible.');
        throw error; // Re-throw so refreshAllModels can handle it
    }
}

async function fetchUserStoryModels() {
    try {
        const response = await fetch('/api/userstory/models');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const models = await response.json();
        
        const select = document.getElementById('userStoryModelSelect');
        select.innerHTML = '';
        
        if (models.length === 0) {
            select.innerHTML = '<option value="">No models available</option>';
        } else {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                select.appendChild(option);
            });
        }
        
        console.log(`Loaded ${models.length} models for user story agent`);
    } catch (error) {
        console.error('Error fetching user story models:', error);
        showUserStoryError('Failed to fetch available models. Make sure Ollama is running and accessible.');
        throw error; // Re-throw so refreshAllModels can handle it
    }
}

async function fetchEmailModels() {
    try {
        const response = await fetch('/api/emailclassifier/models');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const models = await response.json();
        
        const select = document.getElementById('emailModelSelect');
        select.innerHTML = '';
        
        if (models.length === 0) {
            select.innerHTML = '<option value="">No models available</option>';
        } else {
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                select.appendChild(option);
            });
        }
        
        console.log(`Loaded ${models.length} models for email classifier agent`);
    } catch (error) {
        console.error('Error fetching email classifier models:', error);
        showEmailError('Failed to fetch available models. Make sure Ollama is running and accessible.');
        throw error; // Re-throw so refreshAllModels can handle it
    }
}

document.getElementById('summarizeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const model = document.getElementById('modelSelect').value;
    const transcript = document.getElementById('transcript').value.trim();
    const includeSentiment = document.getElementById('includeSentiment').checked;

    if (!model || !transcript) {
        showError('Please select a model and enter a transcript.');
        return;
    }

    setLoading(true);
    hideError();
    hideResults();

    // Record start time
    const startTime = Date.now();

    try {
        const response = await fetch('/api/summarization/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcript: transcript,
                modelName: model,
                includeSentimentAnalysis: includeSentiment
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to process transcript');
        }

        const result = await response.json();
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        
        currentResult = result;
        displayResults(result, elapsedTime);
    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
});

// User Story form handler
document.getElementById('userStoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const model = document.getElementById('userStoryModelSelect').value;
    const inputText = document.getElementById('inputText').value.trim();
    const projectContext = document.getElementById('projectContext').value.trim();

    if (!model || !inputText) {
        showUserStoryError('Please select a model and enter input text.');
        return;
    }

    setUserStoryLoading(true);
    hideUserStoryError();
    hideUserStoryResults();

    // Record start time
    const startTime = Date.now();

    try {
        const response = await fetch('/api/userstory/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputText: inputText,
                modelName: model,
                projectContext: projectContext
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to create user story');
        }

        const result = await response.json();
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        
        currentUserStoryResult = result;
        displayUserStoryResults(result, elapsedTime);
    } catch (error) {
        showUserStoryError(error.message);
    } finally {
        setUserStoryLoading(false);
    }
});

// Email Classifier form handler
document.getElementById('emailForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const model = document.getElementById('emailModelSelect').value;
    const emailContent = document.getElementById('emailContent').value.trim();
    const includeToneAnalysis = document.getElementById('includeToneAnalysis').checked;
    const includeMetadata = document.getElementById('includeMetadata').checked;

    if (!model || !emailContent) {
        showEmailError('Please select a model and enter email content.');
        return;
    }

    setEmailLoading(true);
    hideEmailError();
    hideEmailResults();

    // Record start time
    const startTime = Date.now();

    try {
        const response = await fetch('/api/emailclassifier/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailBody: emailContent,
                modelName: model,
                includeToneAnalysis: includeToneAnalysis,
                includeMetadata: includeMetadata
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to classify email');
        }

        const result = await response.json();
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        
        currentEmailResult = result;
        displayEmailResults(result, elapsedTime);
    } catch (error) {
        showEmailError(error.message);
    } finally {
        setEmailLoading(false);
    }
});

// Agent switching functionality
function switchAgent(agentType) {
    // Update button states
    document.querySelectorAll('.agent-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide agent content
    if (agentType === 'summarizer') {
        document.getElementById('summarizerAgent').style.display = 'block';
        document.getElementById('userStoryAgent').style.display = 'none';
        document.getElementById('emailAgent').style.display = 'none';
    } else if (agentType === 'userstory') {
        document.getElementById('summarizerAgent').style.display = 'none';
        document.getElementById('userStoryAgent').style.display = 'block';
        document.getElementById('emailAgent').style.display = 'none';
    } else if (agentType === 'email') {
        document.getElementById('summarizerAgent').style.display = 'none';
        document.getElementById('userStoryAgent').style.display = 'none';
        document.getElementById('emailAgent').style.display = 'block';
    }
}

function setLoading(loading) {
    const loadingDiv = document.getElementById('loading');
    const submitBtn = document.getElementById('submitBtn');
    const elapsedTimeDiv = document.getElementById('elapsedTime');
    
    if (loading) {
        loadingDiv.style.display = 'block';
        submitBtn.disabled = true;
        
        // Start elapsed time counter
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            elapsedTimeDiv.textContent = `Elapsed time: ${timeString}`;
        }, 1000);
        
        // Store timer reference for cleanup
        loadingDiv.dataset.timer = timer;
    } else {
        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;
        
        // Clear timer
        if (loadingDiv.dataset.timer) {
            clearInterval(parseInt(loadingDiv.dataset.timer));
            loadingDiv.dataset.timer = '';
        }
        elapsedTimeDiv.textContent = '';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

function hideResults() {
    document.getElementById('results').style.display = 'none';
}

// User Story specific functions
function setUserStoryLoading(loading) {
    const loadingDiv = document.getElementById('userStoryLoading');
    const submitBtn = document.getElementById('userStorySubmitBtn');
    const elapsedTimeDiv = document.getElementById('userStoryElapsedTime');
    
    if (loading) {
        loadingDiv.style.display = 'block';
        submitBtn.disabled = true;
        
        // Start elapsed time counter
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            elapsedTimeDiv.textContent = `Elapsed time: ${timeString}`;
        }, 1000);
        
        // Store timer reference for cleanup
        loadingDiv.dataset.timer = timer;
    } else {
        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;
        
        // Clear timer
        if (loadingDiv.dataset.timer) {
            clearInterval(parseInt(loadingDiv.dataset.timer));
            loadingDiv.dataset.timer = '';
        }
        elapsedTimeDiv.textContent = '';
    }
}

function showUserStoryError(message) {
    const errorDiv = document.getElementById('userStoryError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideUserStoryError() {
    document.getElementById('userStoryError').style.display = 'none';
}

function hideUserStoryResults() {
    document.getElementById('userStoryResults').style.display = 'none';
}

// Email Classifier specific functions
function setEmailLoading(loading) {
    const loadingDiv = document.getElementById('emailLoading');
    const submitBtn = document.getElementById('emailSubmitBtn');
    const elapsedTimeDiv = document.getElementById('emailElapsedTime');
    
    if (loading) {
        loadingDiv.style.display = 'block';
        submitBtn.disabled = true;
        
        // Start elapsed time counter
        const startTime = Date.now();
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
            elapsedTimeDiv.textContent = `Elapsed time: ${timeString}`;
        }, 1000);
        
        // Store timer reference for cleanup
        loadingDiv.dataset.timer = timer;
    } else {
        loadingDiv.style.display = 'none';
        submitBtn.disabled = false;
        
        // Clear timer
        if (loadingDiv.dataset.timer) {
            clearInterval(parseInt(loadingDiv.dataset.timer));
            loadingDiv.dataset.timer = '';
        }
        elapsedTimeDiv.textContent = '';
    }
}

function showEmailError(message) {
    const errorDiv = document.getElementById('emailError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideEmailError() {
    document.getElementById('emailError').style.display = 'none';
}

function hideEmailResults() {
    document.getElementById('emailResults').style.display = 'none';
}

function displayResults(result, elapsedTime) {
    // Format elapsed time
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Meta info
    document.getElementById('metaInfo').innerHTML = `
        <strong>Model Used:</strong> ${result.modelUsed}<br>
        <strong>Processed At:</strong> ${new Date(result.processedAt).toLocaleString()}<br>
        <strong>Processing Time:</strong> <span class="processing-time">${timeString}</span>
    `;

    // Summary
    document.getElementById('summaryText').textContent = result.summary;

    // Action Items
    if (result.actionItems && result.actionItems.length > 0) {
        const actionItemsDiv = document.getElementById('actionItems');
        actionItemsDiv.innerHTML = result.actionItems.map(item => `
            <div class="action-item priority-${item.priority.toLowerCase()}">
                <strong>${item.description}</strong><br>
                <small>Assignee: ${item.assignee}</small>
                ${item.dueDate ? `<br><small>Due: ${item.dueDate}</small>` : ''}
                <span class="priority-badge">${item.priority}</span>
            </div>
        `).join('');
        document.getElementById('actionItemsSection').style.display = 'block';
    }

    // Decisions
    if (result.decisions && result.decisions.length > 0) {
        const decisionsDiv = document.getElementById('decisions');
        decisionsDiv.innerHTML = result.decisions.map(decision => `
            <div class="decision">
                <strong>${decision.topic}</strong><br>
                ${decision.decision}<br>
                <small>Made by: ${decision.madeBy}</small>
            </div>
        `).join('');
        document.getElementById('decisionsSection').style.display = 'block';
    }

    // Key Points
    if (result.keyPoints && result.keyPoints.length > 0) {
        const keyPointsDiv = document.getElementById('keyPoints');
        keyPointsDiv.innerHTML = result.keyPoints.map(point => `
            <div class="key-point">
                <strong>${point.category}:</strong> ${point.point}
            </div>
        `).join('');
        document.getElementById('keyPointsSection').style.display = 'block';
    }

    // Speaker Sentiments
    if (result.speakerSentiments && result.speakerSentiments.length > 0) {
        const sentimentsDiv = document.getElementById('sentiments');
        sentimentsDiv.innerHTML = result.speakerSentiments.map(sentiment => `
            <div class="sentiment sentiment-${sentiment.sentiment.toLowerCase()}">
                <strong>${sentiment.speaker}</strong><br>
                ${sentiment.notes}<br>
                <small>Sentiment: ${sentiment.sentiment} (${Math.round(sentiment.confidence * 100)}% confidence)</small>
            </div>
        `).join('');
        document.getElementById('sentimentsSection').style.display = 'block';
    }

    document.getElementById('results').style.display = 'block';
}

function displayUserStoryResults(result, elapsedTime) {
    // Format elapsed time
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Meta info
    document.getElementById('userStoryMetaInfo').innerHTML = `
        <strong>Model Used:</strong> ${result.modelUsed}<br>
        <strong>Processed At:</strong> ${new Date(result.processedAt).toLocaleString()}<br>
        <strong>Processing Time:</strong> <span class="processing-time">${timeString}</span>
    `;

    const userStory = result.userStory;
    
    // User Story Content
    document.getElementById('userStoryContent').innerHTML = `
        <h4>${userStory.title}</h4>
        <div class="story-text">${userStory.story}</div>
        <div class="story-details">
            <div class="detail-item">
                <strong>Persona:</strong> ${userStory.persona}
            </div>
            <div class="detail-item">
                <strong>Want:</strong> ${userStory.want}
            </div>
            <div class="detail-item">
                <strong>So That:</strong> ${userStory.soThat}
            </div>
        </div>
    `;

    // Acceptance Criteria
    if (userStory.acceptanceCriteria && userStory.acceptanceCriteria.length > 0) {
        const acceptanceCriteriaDiv = document.getElementById('acceptanceCriteria');
        acceptanceCriteriaDiv.innerHTML = userStory.acceptanceCriteria.map(criteria => `
            <div class="acceptance-criteria">
                ${criteria}
            </div>
        `).join('');
        document.getElementById('acceptanceCriteriaSection').style.display = 'block';
    }

    // Story Details
    const storyDetailsDiv = document.getElementById('storyDetails');
    storyDetailsDiv.innerHTML = `
        <div class="story-details-grid">
            <div class="story-detail-item">
                <strong>Epic</strong>
                <span>${userStory.epic}</span>
            </div>
            <div class="story-detail-item">
                <strong>Type</strong>
                <span>${userStory.storyType}</span>
            </div>
            <div class="story-detail-item">
                <strong>Priority</strong>
                <span>${userStory.priority}</span>
            </div>
            <div class="story-detail-item">
                <strong>Story Points</strong>
                <span>${userStory.storyPoints || 'Not set'}</span>
            </div>
        </div>
        ${userStory.labels && userStory.labels.length > 0 ? `
            <div style="margin-top: 15px;">
                <strong>Labels:</strong> ${userStory.labels.map(label => `<span style="background: #667eea; color: white; padding: 4px 8px; border-radius: 4px; margin-right: 5px; font-size: 12px;">${label}</span>`).join('')}
            </div>
        ` : ''}
    `;
    document.getElementById('storyDetailsSection').style.display = 'block';

    document.getElementById('userStoryResults').style.display = 'block';
}

function loadRandomSample() {
    const samples = [
        {
            title: "Weekly Team Meeting",
            content: `John (Project Manager): Good morning everyone, let's start our weekly team meeting. Sarah, can you give us an update on the Q4 project timeline?

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

John: I'll look into that this week. Thanks everyone, that's all for today.`
        },
        {
            title: "Product Planning Meeting",
            content: `Alice (Product Manager): Welcome to our Q1 product planning session. Today we need to decide on our roadmap for the next quarter. Let's start with the mobile app features.

Bob (Designer): I've been researching user feedback. The top requests are dark mode, push notifications, and offline sync.

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

Alice: Good point. Let's add that to the Q1 list. Thanks everyone!`
        },
        {
            title: "Client Meeting",
            content: `Client (Sarah Johnson): Hi everyone, thanks for joining us today. We're excited to see the progress on our e-commerce platform.

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

Alex: Great. Thanks everyone for your time today.`
        },
        {
            title: "Technical Architecture Review",
            content: `Lead Architect (Dr. Chen): Welcome to our technical architecture review. Today we're discussing the scalability challenges we've identified.

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

Dr. Chen: Excellent. Thanks everyone for the detailed analysis.`
        },
        {
            title: "Crisis Management Meeting",
            content: `CEO (Jennifer): Thank you everyone for joining this urgent meeting. We have a critical issue with our payment system that's affecting customer transactions.

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

Jennifer: Perfect. Let's get this resolved quickly. Thanks everyone.`
        }
    ];

    // Select a random sample
    const randomIndex = Math.floor(Math.random() * samples.length);
    const selectedSample = samples[randomIndex];

    // Load the sample into the textarea
    document.getElementById('transcript').value = selectedSample.content;

    // Show a brief notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
    `;
    notification.textContent = `Loaded: ${selectedSample.title}`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function downloadMarkdown() {
    if (!currentResult) return;

    const includeSentiment = document.getElementById('includeSentiment').checked;
    const processingTime = document.querySelector('.processing-time')?.textContent || 'Unknown';
    
    const markdown = `# Meeting Summary

**Model Used:** ${currentResult.modelUsed}
**Processed At:** ${new Date(currentResult.processedAt).toLocaleString()}
**Processing Time:** ${processingTime}

## Summary
${currentResult.summary}

## Action Items
${currentResult.actionItems.map(item => `- **${item.assignee}**: ${item.description}${item.dueDate ? ` (Due: ${item.dueDate})` : ''} [${item.priority}]`).join('\n')}

## Decisions
${currentResult.decisions.map(decision => `- **${decision.topic}**: ${decision.decision} (Made by: ${decision.madeBy})`).join('\n')}

## Key Points
${currentResult.keyPoints.map(point => `- **${point.category}**: ${point.point}`).join('\n')}

${includeSentiment && currentResult.speakerSentiments.length > 0 ? `## Speaker Sentiments
${currentResult.speakerSentiments.map(sentiment => `- **${sentiment.speaker}**: ${sentiment.sentiment} (${Math.round(sentiment.confidence * 100)}% confidence) - ${sentiment.notes}`).join('\n')}` : ''}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadUserStoryMarkdown() {
    if (!currentUserStoryResult) return;

    const processingTime = document.querySelector('#userStoryMetaInfo .processing-time')?.textContent || 'Unknown';
    const userStory = currentUserStoryResult.userStory;
    
    const markdown = `# User Story

**Model Used:** ${currentUserStoryResult.modelUsed}
**Processed At:** ${new Date(currentUserStoryResult.processedAt).toLocaleString()}
**Processing Time:** ${processingTime}

## Story Details
**Title:** ${userStory.title}
**Epic:** ${userStory.epic}
**Type:** ${userStory.storyType}
**Priority:** ${userStory.priority}
**Story Points:** ${userStory.storyPoints || 'Not set'}

## User Story
${userStory.story}

**Persona:** ${userStory.persona}
**Want:** ${userStory.want}
**So That:** ${userStory.soThat}

## Acceptance Criteria
${userStory.acceptanceCriteria.map(criteria => `- ${criteria}`).join('\n')}

${userStory.labels && userStory.labels.length > 0 ? `## Labels
${userStory.labels.map(label => `- ${label}`).join('\n')}` : ''}
`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-story-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
} 

// Email Classifier display and utility functions
let currentEmailResult = null;

function getCategoryColorClass(category) {
    const colorMap = {
        'urgent': 'urgent',
        'fyi': 'fyi',
        'action required': 'action-required',
        'spam': 'spam',
        'meeting': 'meeting',
        'follow-up': 'follow-up',
        'newsletter': 'newsletter',
        'other': 'other'
    };
    return colorMap[category] || 'other';
}

function getSuggestedAction(category) {
    const actionMap = {
        'urgent': 'Respond immediately or escalate to management',
        'fyi': 'Read and file for reference',
        'action required': 'Take action or delegate to appropriate team member',
        'spam': 'Delete this email and mark sender as spam',
        'meeting': 'Add to calendar and respond with availability',
        'follow-up': 'Review previous context and respond appropriately',
        'newsletter': 'Read if interested, unsubscribe if unwanted',
        'other': 'Review manually and categorize appropriately'
    };
    return actionMap[category.toLowerCase()] || 'Review manually';
}

function displayEmailResults(result, elapsedTime) {
    const resultsDiv = document.getElementById('emailResults');
    const metaInfoDiv = document.getElementById('emailMetaInfo');
    const classificationDiv = document.getElementById('emailClassification');
    const toneAnalysisSection = document.getElementById('toneAnalysisSection');
    const metadataSection = document.getElementById('metadataSection');
    
    // Display meta information
    metaInfoDiv.innerHTML = `
        <div class="meta-item">
            <strong>Model Used:</strong> ${result.modelUsed}
        </div>
        <div class="meta-item">
            <strong>Processed At:</strong> ${new Date(result.processedAt).toLocaleString()}
        </div>
        <div class="meta-item processing-time">
            <strong>Processing Time:</strong> ${elapsedTime}ms
        </div>
    `;
    
    // Parse multiple categories if separated by "/"
    const categories = result.classification.label.split('/').map(cat => cat.trim()).filter(cat => cat.length > 0);
    
    // Display classification with color coding
    const categoryBadges = categories.map(category => {
        const categoryLower = category.toLowerCase();
        const colorClass = getCategoryColorClass(categoryLower);
        return `<span class="category-badge ${colorClass}">${category}</span>`;
    }).join(' ');
    
    classificationDiv.innerHTML = `
        <div class="classification-item">
            <strong>Category:</strong> ${categoryBadges}
        </div>
        <div class="classification-item">
            <strong>Confidence:</strong> ${Math.round(result.classification.confidence * 100)}%
        </div>
        <div class="classification-item">
            <strong>Reasoning:</strong> ${result.classification.explanation}
        </div>
        <div class="classification-item">
            <strong>Suggested Action:</strong> ${getSuggestedAction(categories[0] || result.classification.label)}
        </div>
    `;
    
    // Display tone analysis if available
    if (result.classification.tone && result.classification.tone.trim() !== '') {
        toneAnalysisSection.style.display = 'block';
        document.getElementById('toneAnalysis').innerHTML = `
            <div class="tone-item">
                <strong>Overall Tone:</strong> <span class="tone-badge ${result.classification.tone.toLowerCase()}">${result.classification.tone}</span>
            </div>
            <div class="tone-item">
                <strong>Priority:</strong> ${result.classification.priority}
            </div>
            <div class="tone-item">
                <strong>Suggested Action:</strong> ${result.classification.suggestedAction}
            </div>
        `;
    } else {
        toneAnalysisSection.style.display = 'none';
    }
    
    // Display metadata if available
    if (result.metadata && Object.keys(result.metadata).length > 0) {
        metadataSection.style.display = 'block';
        const metadataHtml = Object.entries(result.metadata).map(([key, value]) => 
            `<div class="metadata-item"><strong>${key}:</strong> ${value}</div>`
        ).join('');
        document.getElementById('metadata').innerHTML = metadataHtml;
    } else {
        metadataSection.style.display = 'none';
    }
    
    resultsDiv.style.display = 'block';
}

function loadRandomEmailSample() {
    const samples = [
        {
            title: "Urgent Client Request",
            content: `Subject: URGENT - System Down\n\nHi Team,\n\nOur production system has been down for the past 2 hours and our clients are furious. This is a critical issue that needs immediate attention.\n\nThe error logs show a database connection timeout, but I'm not sure if that's the root cause. Can someone from the DevOps team please investigate ASAP?\n\nOur CEO is getting calls from angry customers and we're losing revenue every minute this is down.\n\nPlease respond immediately with an update.\n\nThanks,\nSarah\nCTO`
        },
        {
            title: "Weekly Update",
            content: `Subject: Weekly Team Update\n\nHi everyone,\n\nHope you're all having a great week! Here's a quick update on our progress:\n\n✅ Completed the new user authentication feature\n✅ Deployed the updated API to staging\n🔄 Currently working on the mobile app redesign\n📅 Planning meeting scheduled for Friday at 2 PM\n\nThe new authentication system is working great and we've received positive feedback from our beta users.\n\nLet me know if you have any questions or need help with anything.\n\nBest regards,\nMike\nTeam Lead`
        },
        {
            title: "Meeting Invitation",
            content: `Subject: Q4 Planning Meeting\n\nDear Team,\n\nI hope this email finds you well. I'm writing to invite you to our Q4 planning meeting scheduled for next Tuesday, October 15th, at 10:00 AM in the main conference room.\n\nAgenda:\n- Review Q3 achievements and challenges\n- Discuss Q4 goals and objectives\n- Budget planning and resource allocation\n- Open discussion and feedback\n\nPlease come prepared with your department's Q3 summary and Q4 proposals.\n\nIf you have any agenda items to add, please let me know by Friday.\n\nLooking forward to seeing everyone there!\n\nBest regards,\nJennifer\nCEO`
        },
        {
            title: "Spam Email",
            content: `Subject: CONGRATULATIONS! You've won $1,000,000!\n\nDear Valued Customer,\n\nCONGRATULATIONS! You have been selected as the winner of our exclusive $1,000,000 prize!\n\nTo claim your prize, please click the link below and provide your bank account details immediately:\n\n[CLICK HERE TO CLAIM YOUR PRIZE]\n\nThis offer expires in 24 hours, so act fast!\n\nDon't miss this once-in-a-lifetime opportunity!\n\nBest regards,\nPrize Committee`
        }
    ];

    // Select a random sample
    const randomIndex = Math.floor(Math.random() * samples.length);
    const selectedSample = samples[randomIndex];

    // Load the sample into the textarea
    document.getElementById('emailContent').value = selectedSample.content;

    // Show a brief notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-size: 14px;
    `;
    notification.textContent = `Loaded: ${selectedSample.title}`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

function downloadEmailMarkdown() {
    if (!currentEmailResult) return;

    const processingTime = document.querySelector('#emailMetaInfo .processing-time')?.textContent || 'Unknown';
    const includeToneAnalysis = document.getElementById('includeToneAnalysis').checked;
    const includeMetadata = document.getElementById('includeMetadata').checked;
    
    const categories = currentEmailResult.classification.label.split('/').map(cat => cat.trim()).filter(cat => cat.length > 0);
    const primaryCategory = categories[0] || currentEmailResult.classification.label;
    
    const markdown = `# Email Classification\n\n**Model Used:** ${currentEmailResult.modelUsed}\n**Processed At:** ${new Date(currentEmailResult.processedAt).toLocaleString()}\n**Processing Time:** ${processingTime}\n\n## Classification\n**Categories:** ${categories.join(', ')}\n**Primary Category:** ${primaryCategory}\n**Confidence:** ${Math.round(currentEmailResult.classification.confidence * 100)}%\n**Reasoning:** ${currentEmailResult.classification.explanation}\n**Suggested Action:** ${getSuggestedAction(primaryCategory)}\n\n${includeToneAnalysis && currentEmailResult.classification.tone ? `## Tone Analysis\n**Overall Tone:** ${currentEmailResult.classification.tone}\n**Priority:** ${currentEmailResult.classification.priority}` : ''}\n\n${includeMetadata && currentEmailResult.metadata && Object.keys(currentEmailResult.metadata).length > 0 ? `## Metadata\n${Object.entries(currentEmailResult.metadata).map(([key, value]) => `**${key}:** ${value}`).join('\\n')}` : ''}\n`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-classification-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Ollama URL Management Functions
async function loadCurrentOllamaUrl() {
    try {
        const response = await fetch('/api/ollama/url');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('ollamaUrl').value = data.currentUrl.replace(/\/$/, '');
            updateUrlStatus('Current Ollama URL loaded', 'success');
        } else {
            updateUrlStatus('Failed to load current URL', 'error');
        }
    } catch (error) {
        updateUrlStatus('Error loading URL: ' + error.message, 'error');
    }
}

async function updateOllamaUrl() {
    const urlInput = document.getElementById('ollamaUrl');
    const url = urlInput.value.trim();
    
    if (!url) {
        updateUrlStatus('Please enter a valid URL', 'error');
        return;
    }
    
    // Add protocol if missing
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        fullUrl = 'http://' + url;
    }
    
    try {
        updateUrlStatus('Updating Ollama URL...', '');
        
        const response = await fetch('/api/ollama/url', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: fullUrl })
        });
        
        if (response.ok) {
            updateUrlStatus('Ollama URL updated successfully! Refreshing models...', 'success');
            
            // Refresh models after URL update with better error handling
            try {
                await refreshAllModels();
                updateUrlStatus('Models refreshed with new Ollama instance', 'success');
            } catch (error) {
                updateUrlStatus('URL updated but failed to refresh models: ' + error.message, 'error');
            }
        } else {
            const errorData = await response.text();
            updateUrlStatus('Failed to update URL: ' + errorData, 'error');
        }
    } catch (error) {
        updateUrlStatus('Error updating URL: ' + error.message, 'error');
    }
}

async function resetOllamaUrl() {
    try {
        updateUrlStatus('Resetting to default URL...', '');
        
        const response = await fetch('/api/ollama/url/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (response.ok) {
            updateUrlStatus('Reset to default URL! Refreshing models...', 'success');
            
            // Reload current URL and refresh models with better error handling
            try {
                await loadCurrentOllamaUrl();
                await refreshAllModels();
                updateUrlStatus('Models refreshed with default Ollama instance', 'success');
            } catch (error) {
                updateUrlStatus('URL reset but failed to refresh models: ' + error.message, 'error');
            }
        } else {
            const errorData = await response.text();
            updateUrlStatus('Failed to reset URL: ' + errorData, 'error');
        }
    } catch (error) {
        updateUrlStatus('Error resetting URL: ' + error.message, 'error');
    }
}

async function refreshAllModels() {
    updateUrlStatus('Refreshing models from new Ollama instance...', '');
    
    console.log('Starting model refresh for all agents...');
    
    const results = await Promise.allSettled([
        fetchModels(),
        fetchUserStoryModels(),
        fetchEmailModels()
    ]);
    
    // Log results for debugging
    results.forEach((result, index) => {
        const agentNames = ['Summarization', 'User Story', 'Email Classifier'];
        if (result.status === 'fulfilled') {
            console.log(`${agentNames[index]} models refreshed successfully`);
        } else {
            console.error(`${agentNames[index]} models failed to refresh:`, result.reason);
        }
    });
    
    // Check if any of the model fetches failed
    const failedResults = results.filter(result => result.status === 'rejected');
    
    if (failedResults.length > 0) {
        const errorMessages = failedResults.map(result => result.reason?.message || 'Unknown error').join(', ');
        throw new Error(`Failed to refresh some models: ${errorMessages}`);
    }
    
    // Clear any previous error states
    hideError();
    hideUserStoryError();
    hideEmailError();
    
    console.log('All models refreshed successfully!');
    updateUrlStatus('All models refreshed successfully!', 'success');
}

function updateUrlStatus(message, type) {
    const statusElement = document.getElementById('urlStatus');
    statusElement.textContent = message;
    statusElement.className = 'url-status ' + type;
    
    // Clear status after 5 seconds
    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'url-status';
        }, 5000);
    }
}

console.log('All Ollama URL management functions loaded successfully'); 