/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// Voice search functionality for easier navigation
class TeedeuxVoiceSearch {
    constructor(searchEngineInstance) {
        this.searchEngine = searchEngineInstance;
        this.recognition = null;
        this.isListening = false;
        this.supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        
        // Initialize speech recognition if supported
        if (this.supportsSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            // Set language to English by default
            this.recognition.lang = 'en-US';
            
            // Handle results
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceInput(transcript);
            };
            
            // Handle errors
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
                
                // Dispatch error event
                const errorEvent = new CustomEvent('voicesearch:error', {
                    detail: { error: event.error }
                });
                document.dispatchEvent(errorEvent);
            };
            
            // Handle end of speech
            this.recognition.onend = () => {
                this.isListening = false;
                
                // Dispatch end event
                const endEvent = new CustomEvent('voicesearch:end');
                document.dispatchEvent(endEvent);
            };
        }
    }
    
    // Start listening for voice input
    startListening(language = 'en-US') {
        if (!this.supportsSpeechRecognition) {
            console.error('Speech recognition not supported in this browser');
            
            // Dispatch not supported event
            const notSupportedEvent = new CustomEvent('voicesearch:notsupported');
            document.dispatchEvent(notSupportedEvent);
            return false;
        }
        
        if (this.isListening) {
            this.stopListening();
        }
        
        // Set language based on user preference
        this.recognition.lang = language;
        
        // Start recognition
        try {
            this.recognition.start();
            this.isListening = true;
            
            // Dispatch start event
            const startEvent = new CustomEvent('voicesearch:start');
            document.dispatchEvent(startEvent);
            
            return true;
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            return false;
        }
    }
    
    // Stop listening
    stopListening() {
        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            
            // Dispatch stop event
            const stopEvent = new CustomEvent('voicesearch:stop');
            document.dispatchEvent(stopEvent);
        }
    }
    
    // Handle voice input
    handleVoiceInput(transcript) {
        console.log('Voice input:', transcript);
        
        // Clean up transcript
        const cleanTranscript = transcript.trim().toLowerCase();
        
        // Dispatch result event with transcript
        const resultEvent = new CustomEvent('voicesearch:result', {
            detail: { transcript: cleanTranscript }
        });
        document.dispatchEvent(resultEvent);
        
        // Search using the search engine
        if (this.searchEngine) {
            const searchResults = this.searchEngine.search(cleanTranscript);
            
            // Dispatch search results event
            const searchResultsEvent = new CustomEvent('voicesearch:searchresults', {
                detail: { results: searchResults }
            });
            document.dispatchEvent(searchResultsEvent);
        }
        
        return cleanTranscript;
    }
    
    // Check if browser supports speech recognition
    isSupported() {
        return this.supportsSpeechRecognition;
    }
    
    // Get current listening status
    getListeningStatus() {
        return this.isListening;
    }
    
    // Set language for voice recognition
    setLanguage(language) {
        if (this.recognition) {
            this.recognition.lang = language;
        }
    }
    
    // Map language code to voice recognition language code
    static getLanguageCode(languageCode) {
        const languageMap = {
            'en': 'en-US',
            'fr': 'fr-FR',
            'yo': 'en-US', // Fallback for Yoruba
            'ha': 'en-US', // Fallback for Hausa
            'ig': 'en-US'  // Fallback for Igbo
        };
        
        return languageMap[languageCode] || 'en-US';
    }
}

// Export the voice search
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeedeuxVoiceSearch;
} else {
    // For browser usage
    window.TeedeuxVoiceSearch = TeedeuxVoiceSearch;
}
