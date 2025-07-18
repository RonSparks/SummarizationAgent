let currentResult = null;
let currentUserStoryResult = null;
let currentEmailClassificationResult = null;

// Fetch available models on page load
window.addEventListener('DOMContentLoaded', async () => {
    await fetchModels();
    await fetchUserStoryModels();
    await fetchEmailClassifierModels();
});

async function fetchModels() {
    try {
        const response = await fetch('/api/summarization/models');
        if (!response.ok) {
            throw new Error('Failed to fetch models');
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
    } catch (error) {
        showError('Failed to fetch available models. Make sure Ollama is running.');
    }
}

async function fetchUserStoryModels() {
    try {
        const response = await fetch('/api/userstory/models');
        if (!response.ok) {
            throw new Error('Failed to fetch user story models');
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
    } catch (error) {
        showUserStoryError('Failed to fetch available models. Make sure Ollama is running.');
    }
}

async function fetchEmailClassifierModels() {
    try {
        const response = await fetch('/api/emailclassifier/models');
        if (!response.ok) {
            throw new Error('Failed to fetch email classifier models');
        }
        const models = await response.json();
        
        const select = document.getElementById('emailClassifierModelSelect');
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
    } catch (error) {
        showEmailClassifierError('Failed to fetch available models. Make sure Ollama is running.');
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
document.getElementById('emailClassifierForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const model = document.getElementById('emailClassifierModelSelect').value;
    const emailBody = document.getElementById('emailBody').value.trim();
    const emailMetadata = document.getElementById('emailMetadata').value.trim();

    if (!model || !emailBody) {
        showEmailClassifierError('Please select a model and enter email content.');
        return;
    }

    setEmailClassifierLoading(true);
    hideEmailClassifierError();
    hideEmailClassifierResults();

    // Record start time
    const startTime = Date.now();

    try {
        const response = await fetch('/api/emailclassifier/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailBody: emailBody,
                modelName: model,
                emailMetadata: emailMetadata
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to classify email');
        }

        const result = await response.json();
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        
        currentEmailClassificationResult = result;
        displayEmailClassifierResults(result, elapsedTime);
    } catch (error) {
        showEmailClassifierError(error.message);
    } finally {
        setEmailClassifierLoading(false);
    }
});

// Agent switching functionality
function switchAgent(agentType, event) {
    // Update button states
    document.querySelectorAll('.agent-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Show/hide agent content
    if (agentType === 'summarizer') {
        document.getElementById('summarizerAgent').style.display = 'block';
        document.getElementById('userStoryAgent').style.display = 'none';
        document.getElementById('emailClassifierAgent').style.display = 'none';
    } else if (agentType === 'userstory') {
        document.getElementById('summarizerAgent').style.display = 'none';
        document.getElementById('userStoryAgent').style.display = 'block';
        document.getElementById('emailClassifierAgent').style.display = 'none';
    } else if (agentType === 'emailclassifier') {
        document.getElementById('summarizerAgent').style.display = 'none';
        document.getElementById('userStoryAgent').style.display = 'none';
        document.getElementById('emailClassifierAgent').style.display = 'block';
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
function setEmailClassifierLoading(loading) {
    const loadingDiv = document.getElementById('emailClassifierLoading');
    const submitBtn = document.getElementById('emailClassifierSubmitBtn');
    const elapsedTimeDiv = document.getElementById('emailClassifierElapsedTime');
    
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

function showEmailClassifierError(message) {
    const errorDiv = document.getElementById('emailClassifierError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideEmailClassifierError() {
    document.getElementById('emailClassifierError').style.display = 'none';
}

function hideEmailClassifierResults() {
    document.getElementById('emailClassifierResults').style.display = 'none';
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

function displayEmailClassifierResults(result, elapsedTime) {
    // Format elapsed time
    const minutes = Math.floor(elapsedTime / 60000);
    const seconds = Math.floor((elapsedTime % 60000) / 1000);
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    // Meta info
    document.getElementById('emailClassifierMetaInfo').innerHTML = `
        <strong>Model Used:</strong> ${result.modelUsed}<br>
        <strong>Processed At:</strong> ${new Date(result.processedAt).toLocaleString()}<br>
        <strong>Processing Time:</strong> <span class="processing-time">${timeString}</span>
    `;

    const classification = result.classification;
    
    // Get CSS class for classification label
    const labelClass = getClassificationLabelClass(classification.label);
    
    // Email Classification Content
    document.getElementById('emailClassificationContent').innerHTML = `
        <h4>Email Classification</h4>
        <div class="classification-label ${labelClass}">${classification.label}</div>
        <div class="confidence-bar">
            <div class="confidence-text">Confidence: ${Math.round(classification.confidence * 100)}%</div>
            <div class="confidence-fill" style="width: ${classification.confidence * 100}%"></div>
        </div>
        <div class="explanation">
            <strong>Explanation:</strong> ${classification.explanation}
        </div>
    `;

    // Classification Details
    const classificationDetailsDiv = document.getElementById('classificationDetails');
    classificationDetailsDiv.innerHTML = `
        <div class="classification-details-grid">
            <div class="classification-detail-item">
                <strong>Tone</strong>
                <span>${classification.tone}</span>
            </div>
            <div class="classification-detail-item">
                <strong>Priority</strong>
                <span>${classification.priority}</span>
            </div>
            <div class="classification-detail-item">
                <strong>Suggested Action</strong>
                <span>${classification.suggestedAction}</span>
            </div>
        </div>
        ${classification.tags && classification.tags.length > 0 ? `
            <div class="classification-tags">
                <strong>Tags:</strong><br>
                ${classification.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
        ` : ''}
    `;
    document.getElementById('classificationDetailsSection').style.display = 'block';

    document.getElementById('emailClassifierResults').style.display = 'block';
}

function getClassificationLabelClass(label) {
    const labelLower = label.toLowerCase();
    if (labelLower.includes('urgent')) return 'classification-urgent';
    if (labelLower.includes('fyi')) return 'classification-fyi';
    if (labelLower.includes('action')) return 'classification-action';
    if (labelLower.includes('spam')) return 'classification-spam';
    if (labelLower.includes('meeting')) return 'classification-meeting';
    if (labelLower.includes('follow')) return 'classification-followup';
    if (labelLower.includes('newsletter')) return 'classification-newsletter';
    return 'classification-other';
}

function loadRandomSample() {
    const samples = [
        {
            title: "Product Development Meeting",
            content: `Project Manager (Alex): Thank you for your time, Sarah. We've made significant progress since our last meeting. Let me walk you through the current status.

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

function downloadEmailClassificationMarkdown() {
    if (!currentEmailClassificationResult) return;

    const processingTime = document.querySelector('#emailClassifierMetaInfo .processing-time')?.textContent || 'Unknown';
    const classification = currentEmailClassificationResult.classification;
    
    const markdown = `# Email Classification

**Model Used:** ${currentEmailClassificationResult.modelUsed}
**Processed At:** ${new Date(currentEmailClassificationResult.processedAt).toLocaleString()}
**Processing Time:** ${processingTime}

## Classification Result
**Label:** ${classification.label}
**Confidence:** ${Math.round(classification.confidence * 100)}%
**Tone:** ${classification.tone}
**Priority:** ${classification.priority}

## Explanation
${classification.explanation}

## Suggested Action
${classification.suggestedAction}

${classification.tags && classification.tags.length > 0 ? `## Tags
${classification.tags.map(tag => `- ${tag}`).join('\n')}` : ''}
`;

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