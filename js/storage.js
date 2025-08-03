// Simple LocalStorage-based data management for AnonForum
class AnonStorage {
    constructor() {
        this.STORAGE_KEY = 'anonforum_data';
        this.VERSION = '1.0.0';
        this.data = this.loadData();
        this.initSampleData();
    }

    // Load data from localStorage
    loadData() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Migration check
                if (parsed.version !== this.VERSION) {
                    return this.createEmptyData();
                }
                return parsed;
            }
        } catch (error) {
            console.warn('Failed to load data from localStorage:', error);
        }
        return this.createEmptyData();
    }

    // Create empty data structure
    createEmptyData() {
        return {
            version: this.VERSION,
            posts: [],
            settings: {
                theme: 'dark',
                autoSave: true,
                notifications: true
            },
            stats: {
                totalPosts: 0,
                totalComments: 0,
                totalLikes: 0
            },
            lastUpdate: Date.now()
        };
    }

    // Save data to localStorage
    saveData() {
        try {
            this.data.lastUpdate = Date.now();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.data));
            return true;
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
            return false;
        }
    }

    // Initialize with sample data if empty
    initSampleData() {
        if (this.data.posts.length === 0) {
            const samplePosts = [
                {
                    title: "Crypto có thực sự là tương lai?",
                    content: "Mình thấy nhiều người nói crypto sẽ thay thế tiền truyền thống, nhưng volatility quá cao. Bitcoin thì tốn điện, Ethereum thì phí gas đắt đỏ. Các bạn nghĩ sao về tương lai của cryptocurrency? Có nên đầu tư không?",
                    category: "crypto",
                    tags: ["bitcoin", "ethereum", "investment", "future"],
                    timestamp: Date.now() - 3 * 60 * 60 * 1000, // 3 hours ago
                    likes: 15,
                    comments: [
                        {
                            content: "Mình nghĩ crypto là tương lai, nhưng cần thời gian để ổn định. Công nghệ blockchain rất tiềm năng.",
                            timestamp: Date.now() - 2 * 60 * 60 * 1000,
                            anonId: "CryptoFan2024"
                        },
                        {
                            content: "Đầu tư crypto cần cẩn thận, chỉ bỏ số tiền có thể mất được. DYOR (Do Your Own Research) là quan trọng nhất.",
                            timestamp: Date.now() - 1 * 60 * 60 * 1000,
                            anonId: "SafeInvestor"
                        }
                    ]
                },
                {
                    title: "Remote work có thực sự tốt?",
                    content: "Làm remote được 2 năm rồi, ban đầu thấy tự do lắm nhưng giờ thấy cô đơn. Thiếu tương tác với đồng nghiệp, khó tách biệt work-life balance. Có ai có cùng cảm giác không? Chia sẻ kinh nghiệm với mình!",
                    category: "society",
                    tags: ["remote work", "work life balance", "career", "mental health"],
                    timestamp: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
                    likes: 23,
                    comments: [
                        {
                            content: "Mình cũng vậy! Giải pháp là tìm coworking space hoặc đi làm ở cafe thỉnh thoảng.",
                            timestamp: Date.now() - 5 * 60 * 60 * 1000,
                            anonId: "RemoteWarrior"
                        },
                        {
                            content: "Quan trọng là setup không gian làm việc riêng, có schedule rõ ràng. Và đừng quên giao lưu với bạn bè.",
                            timestamp: Date.now() - 4 * 60 * 60 * 1000,
                            anonId: "WorkFromHome"
                        },
                        {
                            content: "Hybrid model là tốt nhất - 3 ngày office, 2 ngày home. Cân bằng được cả hai.",
                            timestamp: Date.now() - 3 * 60 * 60 * 1000,
                            anonId: "HybridLover"
                        }
                    ]
                },
                {
                    title: "AI sẽ thay thế developer?",
                    content: "ChatGPT, Claude, Copilot ngày càng mạnh. Code được cả website, app, thậm chí debug lỗi cũng khá tốt. Liệu 5-10 năm nữa nghề developer có bị thay thế? Hay chúng ta cần học skill gì để adapt?",
                    category: "tech",
                    tags: ["AI", "programming", "future", "career", "chatgpt"],
                    timestamp: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
                    likes: 31,
                    comments: [
                        {
                            content: "AI chỉ là tool thôi, vẫn cần dev để design architecture, requirement analysis, và creative thinking.",
                            timestamp: Date.now() - 45 * 60 * 1000,
                            anonId: "SeniorDev"
                        },
                        {
                            content: "Mình thấy AI giúp tăng productivity hơn là thay thế. Giờ focus vào problem solving và system design.",
                            timestamp: Date.now() - 30 * 60 * 1000,
                            anonId: "AIOptimist"
                        }
                    ]
                },
                {
                    title: "Stress vì deadline liên tục",
                    content: "Công ty cứ deadline này đến deadline khác, không có thời gian thở. Dự án chồng chéo, meeting liên tục. Cảm giác như robot ấy. Có ai có tips để manage stress không? Hay nên nghỉ việc luôn?",
                    category: "confession",
                    tags: ["stress", "work", "deadline", "mental health"],
                    timestamp: Date.now() - 4 * 60 * 60 * 1000, // 4 hours ago
                    likes: 18,
                    comments: [
                        {
                            content: "Mình hiểu cảm giác đó. Hãy thử nói chuyện với manager về workload, họ có thể không biết bạn đang overwhelmed.",
                            timestamp: Date.now() - 3 * 60 * 60 * 1000,
                            anonId: "SupportiveColleague"
                        }
                    ]
                },
                {
                    title: "Nên học framework nào năm 2024?",
                    content: "Newbie muốn học web development, thấy có React, Vue, Angular, Svelte... nhiều quá không biết chọn cái nào. Các senior cho advice với! Cần học gì để dễ xin việc nhất?",
                    category: "question",
                    tags: ["web development", "framework", "learning", "career advice"],
                    timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
                    likes: 12,
                    comments: []
                }
            ];

            // Add sample posts with generated IDs and anon IDs
            samplePosts.forEach(post => {
                const newPost = {
                    ...post,
                    id: this.generateId(),
                    anonId: this.generateAnonId(),
                    comments: post.comments.map(comment => ({
                        ...comment,
                        id: this.generateId()
                    }))
                };
                this.data.posts.push(newPost);
            });

            this.updateStats();
            this.saveData();
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // Generate anonymous ID
    generateAnonId() {
        const prefixes = [
            'Anon', 'Ghost', 'Shadow', 'Phantom', 'Mystery', 'Unknown', 
            'Cipher', 'Void', 'Echo', 'Raven', 'Sage', 'Nova'
        ];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const number = Math.floor(Math.random() * 9999) + 1000;
        return `${prefix}${number}`;
    }

    // Update statistics
    updateStats() {
        const totalComments = this.data.posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
        const totalLikes = this.data.posts.reduce((sum, post) => sum + (post.likes || 0), 0);
        
        this.data.stats = {
            totalPosts: this.data.posts.length,
            totalComments: totalComments,
            totalLikes: totalLikes
        };
    }

    // Create new post
    createPost(postData) {
        const newPost = {
            id: this.generateId(),
            anonId: this.generateAnonId(),
            title: postData.title.trim(),
            content: postData.content.trim(),
            category: postData.category,
            tags: this.parseTags(postData.tags),
            timestamp: Date.now(),
            likes: 0,
            comments: []
        };

        this.data.posts.unshift(newPost);
        this.updateStats();
        this.saveData();
        return newPost;
    }

    // Parse tags from string
    parseTags(tagsString) {
        if (!tagsString || !tagsString.trim()) return [];
        
        return tagsString
            .split(',')
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag.length > 0 && tag.length <= 50)
            .slice(0, 5); // Max 5 tags
    }

    // Get all posts with optional filtering
    getPosts(category = 'all', sortBy = 'timestamp') {
        let posts = [...this.data.posts];
        
        // Filter by category
        if (category !== 'all') {
            posts = posts.filter(post => post.category === category);
        }
        
        // Sort posts
        switch (sortBy) {
            case 'likes':
                posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'comments':
                posts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
                break;
            case 'timestamp':
            default:
                posts.sort((a, b) => b.timestamp - a.timestamp);
                break;
        }
        
        return posts;
    }

    // Get single post by ID
    getPost(postId) {
        return this.data.posts.find(post => post.id === postId);
    }

    // Like a post
    likePost(postId) {
        const post = this.getPost(postId);
        if (post) {
            // Check if already liked (simple check using localStorage)
            const likedPosts = this.getLikedPosts();
            if (likedPosts.includes(postId)) {
                return { success: false, message: 'Already liked' };
            }

            post.likes = (post.likes || 0) + 1;
            this.addLikedPost(postId);
            this.updateStats();
            this.saveData();
            return { success: true, likes: post.likes };
        }
        return { success: false, message: 'Post not found' };
    }

    // Get liked posts from localStorage
    getLikedPosts() {
        try {
            const liked = localStorage.getItem('anonforum_liked');
            return liked ? JSON.parse(liked) : [];
        } catch {
            return [];
        }
    }

    // Add post to liked list
    addLikedPost(postId) {
        try {
            const liked = this.getLikedPosts();
            if (!liked.includes(postId)) {
                liked.push(postId);
                localStorage.setItem('anonforum_liked', JSON.stringify(liked));
            }
        } catch (error) {
            console.warn('Failed to save liked post:', error);
        }
    }

    // Create new comment
    createComment(postId, commentData) {
        const post = this.getPost(postId);
        if (!post) {
            return { success: false, message: 'Post not found' };
        }

        const newComment = {
            id: this.generateId(),
            anonId: this.generateAnonId(),
            content: commentData.content.trim(),
            timestamp: Date.now()
        };

        if (!post.comments) {
            post.comments = [];
        }
        
        post.comments.push(newComment);
        this.updateStats();
        this.saveData();
        
        return { success: true, comment: newComment };
    }

    // Get statistics
    getStats() {
        this.updateStats();
        return { ...this.data.stats };
    }

    // Search posts
    searchPosts(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const searchTerm = query.toLowerCase().trim();
        return this.data.posts.filter(post => {
            return (
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.tags.some(tag => tag.includes(searchTerm))
            );
        });
    }

    // Get posts by tag
    getPostsByTag(tag) {
        return this.data.posts.filter(post => 
            post.tags.includes(tag.toLowerCase())
        );
    }

    // Export data for backup
    exportData() {
        const exportData = {
            ...this.data,
            exportDate: new Date().toISOString(),
            exportVersion: this.VERSION
        };
        return JSON.stringify(exportData, null, 2);
    }

    // Import data from backup
    importData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            
            // Validate data structure
            if (!importedData.posts || !Array.isArray(importedData.posts)) {
                throw new Error('Invalid data format');
            }

            // Merge with existing data or replace
            const shouldMerge = confirm('Merge with existing data? (Cancel to replace all data)');
            
            if (shouldMerge) {
                // Merge posts (avoid duplicates by ID)
                const existingIds = new Set(this.data.posts.map(p => p.id));
                const newPosts = importedData.posts.filter(p => !existingIds.has(p.id));
                this.data.posts = [...this.data.posts, ...newPosts];
            } else {
                // Replace all data
                this.data = {
                    ...this.createEmptyData(),
                    ...importedData,
                    version: this.VERSION
                };
            }

            this.updateStats();
            this.saveData();
            return { success: true, message: 'Data imported successfully' };
        } catch (error) {
            console.error('Import failed:', error);
            return { success: false, message: 'Failed to import data: ' + error.message };
        }
    }

    // Clear all data
    clearAllData() {
        this.data = this.createEmptyData();
        this.saveData();
        
        // Also clear liked posts
        try {
            localStorage.removeItem('anonforum_liked');
        } catch (error) {
            console.warn('Failed to clear liked posts:', error);
        }
        
        return true;
    }

    // Get data size in KB
    getDataSize() {
        try {
            const dataString = JSON.stringify(this.data);
            return Math.round((dataString.length * 2) / 1024); // Rough estimate in KB
        } catch {
            return 0;
        }
    }

    // Clean old data (if needed in future)
    cleanOldData(daysOld = 30) {
        const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        const originalLength = this.data.posts.length;
        
        this.data.posts = this.data.posts.filter(post => post.timestamp > cutoffTime);
        
        const removedCount = originalLength - this.data.posts.length;
        if (removedCount > 0) {
            this.updateStats();
            this.saveData();
        }
        
        return removedCount;
    }

    // Get trending tags
    getTrendingTags(limit = 10) {
        const tagCounts = {};
        
        this.data.posts.forEach(post => {
            post.tags.forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
        
        return Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, limit)
            .map(([tag, count]) => ({ tag, count }));
    }

    // Get category distribution
    getCategoryStats() {
        const categories = {};
        
        this.data.posts.forEach(post => {
            categories[post.category] = (categories[post.category] || 0) + 1;
        });
        
        return categories;
    }

    // Get recent activity (last 24 hours)
    getRecentActivity() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        const recentPosts = this.data.posts.filter(post => post.timestamp > oneDayAgo);
        const recentComments = this.data.posts.reduce((count, post) => {
            const postRecentComments = post.comments?.filter(comment => comment.timestamp > oneDayAgo) || [];
            return count + postRecentComments.length;
        }, 0);
        
        return {
            posts: recentPosts.length,
            comments: recentComments
        };
    }

    // Validate post data
    validatePost(postData) {
        const errors = [];
        
        if (!postData.title || postData.title.trim().length < 3) {
            errors.push('Title must be at least 3 characters long');
        }
        
        if (!postData.title || postData.title.trim().length > 200) {
            errors.push('Title cannot exceed 200 characters');
        }
        
        if (!postData.content || postData.content.trim().length < 10) {
            errors.push('Content must be at least 10 characters long');
        }
        
        if (!postData.content || postData.content.trim().length > 2000) {
            errors.push('Content cannot exceed 2000 characters');
        }
        
        if (!postData.category) {
            errors.push('Category is required');
        }
        
        const validCategories = ['general', 'tech', 'crypto', 'society', 'confession', 'question', 'random'];
        if (postData.category && !validCategories.includes(postData.category)) {
            errors.push('Invalid category');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Validate comment data
    validateComment(commentData) {
        const errors = [];
        
        if (!commentData.content || commentData.content.trim().length < 1) {
            errors.push('Comment cannot be empty');
        }
        
        if (!commentData.content || commentData.content.trim().length > 1000) {
            errors.push('Comment cannot exceed 1000 characters');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const total = 5 * 1024 * 1024; // 5MB typical localStorage limit
            let used = 0;
            
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    used += localStorage[key].length + key.length;
                }
            }
            
            return {
                used: Math.round(used / 1024), // KB
                total: Math.round(total / 1024), // KB
                percentage: Math.round((used / total) * 100)
            };
        } catch {
            return { used: 0, total: 5120, percentage: 0 };
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnonStorage;
} else {
    window.AnonStorage = AnonStorage;
}