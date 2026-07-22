/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Main integration file for AI search features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search engine
    const searchEngine = new TeedeuxSearchEngine();
    
    // Initialize chat support
    const chatSupport = new TeedeuxChatSupport();
    
    // Initialize voice search with the search engine
    const voiceSearch = new TeedeuxVoiceSearch(searchEngine);
    
    // Set up search functionality
    setupSearch(searchEngine);
    
    // Set up chat support
    setupChatSupport(chatSupport);
    
    // Set up voice search
    setupVoiceSearch(voiceSearch, searchEngine);
});

// Set up search functionality
function setupSearch(searchEngine) {
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.getElementById('search-suggestions');
    const searchResults = document.getElementById('search-results');
    const popularSearches = document.getElementById('popular-searches');
    
    if (!searchInput) return;
    
    // Add event listener for input changes
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Show suggestions as user types
        if (query.length >= 2) {
            const suggestions = searchEngine.getSuggestions(query);
            displaySuggestions(suggestions, searchSuggestions);
        } else {
            // Clear suggestions if query is too short
            if (searchSuggestions) {
                searchSuggestions.innerHTML = '';
                searchSuggestions.style.display = 'none';
            }
        }
    });
    
    // Add event listener for search form submission
    const searchForm = searchInput.closest('form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query.length >= 2) {
                const results = searchEngine.search(query);
                displaySearchResults(results, searchResults);
            }
        });
    }
    
    // Display popular searches if element exists
    if (popularSearches) {
        displayPopularSearches(searchEngine.getPopularSearches(), popularSearches);
    }
}

// Display search suggestions
function displaySuggestions(suggestions, suggestionsElement) {
    if (!suggestionsElement) return;
    
    if (suggestions.length > 0) {
        suggestionsElement.innerHTML = '';
        
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item p-2 border-bottom';
            suggestionItem.textContent = suggestion;
            
            suggestionItem.addEventListener('click', function() {
                const searchInput = document.getElementById('search-input');
                if (searchInput) {
                    searchInput.value = suggestion;
                    suggestionsElement.innerHTML = '';
                    suggestionsElement.style.display = 'none';
                    
                    // Trigger search
                    const searchForm = searchInput.closest('form');
                    if (searchForm) {
                        searchForm.dispatchEvent(new Event('submit'));
                    }
                }
            });
            
            suggestionsElement.appendChild(suggestionItem);
        });
        
        suggestionsElement.style.display = 'block';
    } else {
        suggestionsElement.innerHTML = '';
        suggestionsElement.style.display = 'none';
    }
}

// Display search results
function displaySearchResults(results, resultsElement) {
    if (!resultsElement) return;
    
    if (results.length > 0) {
        resultsElement.innerHTML = '';
        
        // Create results header
        const header = document.createElement('h5');
        header.className = 'fw-bold mb-3';
        header.textContent = 'Search Results';
        resultsElement.appendChild(header);
        
        // Create results list
        const resultsList = document.createElement('div');
        resultsList.className = 'list-group mb-4';
        
        results.forEach(result => {
            const resultItem = document.createElement('a');
            resultItem.className = 'list-group-item list-group-item-action';
            resultItem.href = `shop-grid-3-column.html?search=${encodeURIComponent(result)}`;
            resultItem.textContent = result;
            
            resultsList.appendChild(resultItem);
        });
        
        resultsElement.appendChild(resultsList);
        resultsElement.style.display = 'block';
    } else {
        resultsElement.innerHTML = `
            <h5 class="fw-bold mb-3">Search Results</h5>
            <p class="text-muted">No results found. Try different keywords or browse our categories.</p>
        `;
        resultsElement.style.display = 'block';
    }
}

// Display popular searches
function displayPopularSearches(searches, popularSearchesElement) {
    if (!popularSearchesElement) return;
    
    popularSearchesElement.innerHTML = '';
    
    // Create header
    const header = document.createElement('h6');
    header.className = 'fw-bold mb-2';
    header.textContent = 'Popular Searches';
    popularSearchesElement.appendChild(header);
    
    // Create tags container
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'd-flex flex-wrap gap-2';
    
    searches.forEach(search => {
        const tag = document.createElement('a');
        tag.className = 'badge bg-light text-dark text-decoration-none';
        tag.href = `shop-grid-3-column.html?search=${encodeURIComponent(search)}`;
        tag.textContent = search;
        
        tagsContainer.appendChild(tag);
    });
    
    popularSearchesElement.appendChild(tagsContainer);
}

// Set up chat support
function setupChatSupport(chatSupport) {
    const chatButton = document.getElementById('chat-support-button');
    const chatContainer = document.getElementById('chat-support-container');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');
    
    if (!chatButton || !chatContainer || !chatMessages || !chatInput || !chatForm) return;
    
    // Toggle chat container when button is clicked
    chatButton.addEventListener('click', function() {
        chatContainer.classList.toggle('d-none');
        
        // If opening the chat, show welcome message
        if (!chatContainer.classList.contains('d-none')) {
            // Clear previous messages
            chatMessages.innerHTML = '';
            
            // Add welcome message
            addChatMessage('Welcome to Teedeux support! How can I help you today?', 'bot');
            
            // Add suggested questions
            const suggestedQuestions = chatSupport.getSuggestedQuestions();
            addSuggestedQuestions(suggestedQuestions, chatMessages);
        }
    });
    
    // Handle chat form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (message) {
            // Add user message to chat
            addChatMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Get response from chat support
            const response = chatSupport.getResponse(message);
            
            // Add bot response to chat after a short delay
            setTimeout(() => {
                addChatMessage(response.response, 'bot');
                
                // If it's a general response, add suggested questions
                if (response.isGeneral) {
                    const suggestedQuestions = chatSupport.getSuggestedQuestions(response.category);
                    addSuggestedQuestions(suggestedQuestions, chatMessages);
                }
            }, 500);
        }
    });
}

// Add a message to the chat
function addChatMessage(message, sender) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender === 'user' ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = `message-content ${sender === 'user' ? 'bg-primary text-white' : 'bg-light'}`;
    messageContent.textContent = message;
    
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add suggested questions to the chat
function addSuggestedQuestions(questions, chatMessages) {
    if (!chatMessages || !questions || questions.length === 0) return;
    
    const suggestionsElement = document.createElement('div');
    suggestionsElement.className = 'suggested-questions';
    
    const header = document.createElement('p');
    header.className = 'text-muted small mb-2';
    header.textContent = 'You might also ask:';
    suggestionsElement.appendChild(header);
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'd-flex flex-wrap gap-2';
    
    questions.forEach(question => {
        const button = document.createElement('button');
        button.className = 'btn btn-sm btn-outline-primary';
        button.textContent = question;
        
        button.addEventListener('click', function() {
            const chatInput = document.getElementById('chat-input');
            const chatForm = document.getElementById('chat-form');
            
            if (chatInput && chatForm) {
                chatInput.value = question;
                chatForm.dispatchEvent(new Event('submit'));
            }
        });
        
        buttonsContainer.appendChild(button);
    });
    
    suggestionsElement.appendChild(buttonsContainer);
    chatMessages.appendChild(suggestionsElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Set up voice search
function setupVoiceSearch(voiceSearch, searchEngine) {
    const voiceSearchButton = document.getElementById('voice-search-button');
    const searchInput = document.getElementById('search-input');
    const voiceSearchIndicator = document.getElementById('voice-search-indicator');
    
    if (!voiceSearchButton || !searchInput) return;
    
    // Check if browser supports speech recognition
    if (!voiceSearch.isSupported()) {
        voiceSearchButton.style.display = 'none';
        return;
    }
    
    // Add click event listener to voice search button
    voiceSearchButton.addEventListener('click', function() {
        // If already listening, stop listening
        if (voiceSearch.getListeningStatus()) {
            voiceSearch.stopListening();
            return;
        }
        
        // Get current language from language switcher
        const currentLanguage = localStorage.getItem('teedeux_language') || 'en';
        const voiceLanguage = TeedeuxVoiceSearch.getLanguageCode(currentLanguage);
        
        // Start listening
        voiceSearch.startListening(voiceLanguage);
        
        // Show listening indicator
        if (voiceSearchIndicator) {
            voiceSearchIndicator.classList.remove('d-none');
        }
    });
    
    // Listen for voice search events
    document.addEventListener('voicesearch:result', function(e) {
        const transcript = e.detail.transcript;
        
        // Update search input with transcript
        if (searchInput) {
            searchInput.value = transcript;
            
            // Trigger input event to show suggestions
            searchInput.dispatchEvent(new Event('input'));
            
            // Trigger search
            const searchForm = searchInput.closest('form');
            if (searchForm) {
                searchForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Hide listening indicator
        if (voiceSearchIndicator) {
            voiceSearchIndicator.classList.add('d-none');
        }
    });
    
    // Listen for voice search end event
    document.addEventListener('voicesearch:end', function() {
        // Hide listening indicator
        if (voiceSearchIndicator) {
            voiceSearchIndicator.classList.add('d-none');
        }
    });
}
