/*
Template Name: Teedeux - African Food Vendor Mobile Template
Author: Teedeux Team
Version: 1.0
*/

// AI-powered search engine for African food terminology
class TeedeuxSearchEngine {
    constructor() {
        this.foodTerminology = {
            // Nigerian food terminology
            "jollof": ["jollof rice", "party jollof", "smoky jollof", "Nigerian jollof", "Ghana jollof"],
            "egusi": ["egusi soup", "melon seed soup", "egusi stew", "egusi and fufu"],
            "suya": ["suya", "beef suya", "chicken suya", "suya spice", "yaji"],
            "pounded yam": ["pounded yam", "iyan", "poundo yam", "pounded yam flour"],
            "amala": ["amala", "yam flour", "elubo", "amala and ewedu"],
            "efo": ["efo riro", "vegetable soup", "spinach stew", "efo elegusi"],
            "ogbono": ["ogbono soup", "apon", "wild mango seed", "draw soup"],
            "banga": ["banga soup", "palm fruit soup", "ofe akwu"],
            "moin moin": ["moin moin", "moi moi", "bean pudding", "steamed beans"],
            "akara": ["akara", "bean cake", "kosai", "fried bean balls"],
            "fufu": ["fufu", "cassava fufu", "pounded cassava", "akpu"],
            "eba": ["eba", "garri", "cassava meal", "gari and soup"],
            "chin chin": ["chin chin", "fried pastry", "sweet snack"],
            "puff puff": ["puff puff", "bofrot", "Nigerian doughnut", "fried dough"],
            "zobo": ["zobo", "zobo drink", "hibiscus drink", "sorrel drink"],
            "kunu": ["kunu", "millet drink", "tiger nut drink", "kunu zaki"]
        };
        
        this.synonyms = {
            "pepper": ["hot", "spicy", "chili", "scotch bonnet", "ata rodo"],
            "stew": ["sauce", "gravy", "obe"],
            "soup": ["broth", "liquid dish", "obe"],
            "beans": ["black-eyed peas", "honey beans", "ewa"],
            "yam": ["white yam", "water yam", "isu"],
            "rice": ["long grain", "basmati", "local rice", "iresi"],
            "meat": ["beef", "goat meat", "chicken", "eran"],
            "fish": ["tilapia", "catfish", "mackerel", "eja"]
        };
        
        this.popularSearches = [
            "jollof rice recipe",
            "best Nigerian soups",
            "how to make pounded yam",
            "authentic suya spice",
            "egusi soup ingredients",
            "Nigerian snacks",
            "traditional breakfast",
            "Nigerian beverages"
        ];
    }
    
    // Search for food items based on query
    search(query) {
        query = query.toLowerCase().trim();
        let results = [];
        
        // Direct match in food terminology
        for (const [key, terms] of Object.entries(this.foodTerminology)) {
            if (key.includes(query) || terms.some(term => term.includes(query))) {
                results.push(...terms);
            }
        }
        
        // Check synonyms
        for (const [key, synonymList] of Object.entries(this.synonyms)) {
            if (key.includes(query) || synonymList.some(syn => syn.includes(query))) {
                // Find related food items
                for (const [foodKey, foodTerms] of Object.entries(this.foodTerminology)) {
                    if (foodKey.includes(key) || foodTerms.some(term => term.includes(key))) {
                        results.push(...foodTerms);
                    }
                }
            }
        }
        
        // Remove duplicates and sort by relevance
        results = [...new Set(results)];
        
        // Sort results by how closely they match the query
        results.sort((a, b) => {
            const aContains = a.includes(query);
            const bContains = b.includes(query);
            
            if (aContains && !bContains) return -1;
            if (!aContains && bContains) return 1;
            return a.localeCompare(b);
        });
        
        return results;
    }
    
    // Get popular searches
    getPopularSearches() {
        return this.popularSearches;
    }
    
    // Get search suggestions as user types
    getSuggestions(partialQuery) {
        if (!partialQuery || partialQuery.length < 2) return [];
        
        partialQuery = partialQuery.toLowerCase().trim();
        let suggestions = [];
        
        // Check food terminology for matches
        for (const [key, terms] of Object.entries(this.foodTerminology)) {
            if (key.includes(partialQuery)) {
                suggestions.push(key);
            }
            
            for (const term of terms) {
                if (term.includes(partialQuery) && !suggestions.includes(term)) {
                    suggestions.push(term);
                }
            }
        }
        
        // Limit suggestions to top 5
        return suggestions.slice(0, 5);
    }
}

// Export the search engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TeedeuxSearchEngine;
} else {
    // For browser usage
    window.TeedeuxSearchEngine = TeedeuxSearchEngine;
}
