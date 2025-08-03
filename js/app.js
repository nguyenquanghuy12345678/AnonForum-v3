// Main Application Logic for AnonForum
class AnonForum {
    constructor() {
        this.storage = new AnonStorage();
        this.currentCategory = 'all';
        this.currentSort = 'timestamp';
        this.currentPostId = null;
        this.isSubmitting = false;
        
        this.init();
    }

    // Initialize the application
    async init() {
        try {
            this.showLoadingScreen();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load initial data
            this.loadPosts();
            this.updateStats();
            this.updateOnlineCounter();
            
            // Start periodic updates
            this.startPeriodicUpdates();
            
            // Initialize character counters
            this.initCharacterCounters();
            
            // Hide loading screen
            setTimeout(() => this.hideLoadingScreen(), 1000);
            
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showNotification('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang.', 'error');
        }
    }

    // Setup all event listeners
    setupEventListeners() {
        // Post form submission
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => this.handlePostSubmit(e));
        }

        // Comment form submission
        const commentForm = document.getElementById('commentForm');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        }

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
            
            // Ctrl/Cmd + Enter to submit forms
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const activeForm = document.querySelector('form:focus-within');
                if (activeForm) {
                    activeForm.requestSubmit();
                }
            }
        });

        // Auto-save form data
        this.setupAutoSave();

        // Handle visibility change for online counter
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateOnlineCounter();
            }
        });
    }

    // Initialize character counters
    initCharacterCounters() {
        const counters = [
            { input: 'postTitle', counter: 'titleCounter', max: 200 },
            { input: 'postContent', counter: 'contentCounter', max: 2000 },
            { input: 'commentContent', counter: 'commentCounter', max: 1000 }
        ];

        counters.forEach(({ input, counter, max }) => {
            const inputEl = document.getElementById(input);
            const counterEl = document.getElementById(counter);
            
            if (inputEl && counterEl) {
                const updateCounter = () => {
                    const length = inputEl.value.length;
                    counterEl.textContent = length;
                    
                    // Color coding based on usage
                    if (length > max * 0.9) {
                        counterEl.style.color = 'var(--error)';
                    } else if (length > max * 0.75) {
                        counterEl.style.color = 'var(--warning)';
                    } else {
                        counterEl.style.color = 'var(--text-dim)';
                    }
                };
                
                inputEl.addEventListener('input', updateCounter);
                inputEl.addEventListener('paste', () => setTimeout(updateCounter, 0));
                
                // Initial update
                updateCounter();
            }
        });
    }

    // Auto-save form data
    setupAutoSave() {
        const inputs = ['postTitle', 'postContent', 'postCategory', 'postTags'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.saveFormDraft());
                
                // Load saved data
                const saved = localStorage.getItem(`anonforum_draft_${inputId}`);
                if (saved && input.value === '') {
                    input.value = saved;
                    input.dispatchEvent(new Event('input'));
                }
            }
        });
    }

    // Save form draft
    saveFormDraft() {
        const inputs = ['postTitle', 'postContent', 'postCategory', 'postTags'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                try {
                    localStorage.setItem(`anonforum_draft_${inputId}`, input.value);
                } catch (error) {
                    console.warn('Failed to save draft:', error);
                }
            }
        });
    }

    // Clear form draft
    clearFormDraft() {
        const inputs = ['postTitle', 'postContent', 'postCategory', 'postTags'];
        
        inputs.forEach(inputId => {
            try {
                localStorage.removeItem(`anonforum_draft_${inputId}`);
            } catch (error) {
                console.warn('Failed to clear draft:', error);
            }
        });
    }

    // Show/hide loading screen
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (app) app.style.display = 'none';
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                if (app) app.style.display = 'block';
            }, 500);
        }
    }

    // Start periodic updates
    startPeriodicUpdates() {
        // Update online counter every 30 seconds
        setInterval(() => this.updateOnlineCounter(), 30000);
        
        // Update stats every 5 minutes
        setInterval(() => this.updateStats(), 5 * 60 * 1000);
    }

    // Update online counter with simulated users
    updateOnlineCounter() {
        const baseCount = 50;
        const variance = Math.floor(Math.random() * 100);
        const timeBonus = Math.floor(Math.sin(Date.now() / 600000) * 20); // Varies over 10 minutes
        const count = Math.max(1, baseCount + variance + timeBonus);
        
        const onlineCountEl = document.getElementById('onlineCount');
        if (onlineCountEl) {
            onlineCountEl.textContent = count;
        }
    }

    // Update statistics display
    updateStats() {
        const stats = this.storage.getStats();
        
        const postCountEl = document.getElementById('postCount');
        const commentCountEl = document.getElementById('commentCount');
        
        if (postCountEl) postCountEl.textContent = this.formatNumber(stats.totalPosts);
        if (commentCountEl) commentCountEl.textContent = this.formatNumber(stats.totalComments);
    }

    // Format numbers (1000 -> 1K, 1000000 -> 1M)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Handle post form submission
    async handlePostSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const formData = this.getFormData();
        const validation = this.storage.validatePost(formData);
        
        if (!validation.isValid) {
            this.showNotification(validation.errors[0], 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.setSubmitButtonLoading(true);
        
        try {
            const newPost = this.storage.createPost(formData);
            
            this.showNotification('✅ Bài viết đã được đăng thành công!', 'success');
            this.clearForm();
            this.clearFormDraft();
            this.hideCreatePostForm();
            
            // Refresh posts and stats
            this.loadPosts();
            this.updateStats();
            
        } catch (error) {
            console.error('Failed to create post:', error);
            this.showNotification('Không thể đăng bài viết. Vui lòng thử lại.', 'error');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButtonLoading(false);
        }
    }

    // Handle comment form submission
    async handleCommentSubmit(e) {
        e.preventDefault();
        
        if (!this.currentPostId) return;
        
        const commentContent = document.getElementById('commentContent').value.trim();
        const validation = this.storage.validateComment({ content: commentContent });
        
        if (!validation.isValid) {
            this.showNotification(validation.errors[0], 'error');
            return;
        }
        
        try {
            const result = this.storage.createComment(this.currentPostId, { content: commentContent });
            
            if (result.success) {
                this.showNotification('💬 Bình luận đã được đăng!', 'success');
                document.getElementById('commentContent').value = '';
                
                // Refresh comments in modal
                this.loadCommentsForPost(this.currentPostId);
                this.updateStats();
                
                // Update comment count in main view
                this.updatePostCommentCount(this.currentPostId);
            } else {
                this.showNotification(result.message, 'error');
            }
            
        } catch (error) {
            console.error('Failed to create comment:', error);
            this.showNotification('Không thể đăng bình luận. Vui lòng thử lại.', 'error');
        }
    }

    // Get form data
    getFormData() {
        return {
            title: document.getElementById('postTitle').value.trim(),
            content: document.getElementById('postContent').value.trim(),
            category: document.getElementById('postCategory').value,
            tags: document.getElementById('postTags').value.trim()
        };
    }

    // Set submit button loading state
    setSubmitButtonLoading(isLoading) {
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnIcon = submitBtn.querySelector('.btn-icon');
        
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Đang đăng...';
            btnIcon.textContent = '⏳';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Đăng bài';
            btnIcon.textContent = '🚀';
        }
    }

    // Clear form
    clearForm() {
        const form = document.getElementById('postForm');
        if (form) {
            form.reset();
            
            // Reset character counters
            document.getElementById('titleCounter').textContent = '0';
            document.getElementById('contentCounter').textContent = '0';
            
            // Reset counter colors
            ['titleCounter', 'contentCounter'].forEach(id => {
                document.getElementById(id).style.color = 'var(--text-dim)';
            });
        }
    }

    // Load and render posts
    loadPosts() {
        const posts = this.storage.getPosts(this.currentCategory, this.currentSort);
        this.renderPosts(posts);
    }

    // Render posts to container
    renderPosts(posts) {
        const container = document.getElementById('postsContainer');
        
        if (posts.length === 0) {
            container.innerHTML = this.renderEmptyState();
            return;
        }
        
        container.innerHTML = posts.map(post => this.renderPost(post)).join('');
    }

    // Render single post
    renderPost(post) {
        const timeAgo = this.formatTimeAgo(post.timestamp);
        const tags = post.tags?.map(tag => `<span class="tag">#${this.escapeHtml(tag)}</span>`).join('') || '';
        const commentCount = post.comments?.length || 0;
        
        return `
            <article class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <span class="anon-id">👤 ${this.escapeHtml(post.anonId)}</span>
                    <span class="timestamp">${timeAgo}</span>
                </div>
                
                <h2 class="post-title">${this.escapeHtml(post.title)}</h2>
                
                ${tags ? `<div class="post-tags">${tags}</div>` : ''}
                
                <div class="post-content">${this.formatContent(post.content)}</div>
                
                <div class="post-actions">
                    <button class="action-btn" onclick="app.likePost('${post.id}')" data-post-id="${post.id}" data-action="like">
                        <span>👍</span>
                        <span class="like-count">${post.likes || 0}</span>
                    </button>
                    
                    <button class="action-btn" onclick="app.showComments('${post.id}')">
                        <span>💬</span>
                        <span class="comment-count">${commentCount}</span>
                    </button>
                    
                    <button class="action-btn" onclick="app.sharePost('${post.id}')">
                        <span>🔗</span>
                        <span>Chia sẻ</span>
                    </button>
                </div>
            </article>
        `;
    }

    // Render empty state
    renderEmptyState() {
        const categoryName = this.getCategoryName(this.currentCategory);
        
        return `
            <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>Chưa có bài viết nào</h3>
                <p>Chưa có bài viết nào trong ${categoryName}. Hãy là người đầu tiên chia sẻ!</p>
                <button class="btn btn-primary" onclick="app.showCreatePostForm()">
                    ✍️ Tạo bài viết đầu tiên
                </button>
            </div>
        `;
    }

    // Get category display name
    getCategoryName(category) {
        const categories = {
            'all': 'tất cả chủ đề',
            'general': 'tổng hợp',
            'tech': 'công nghệ',
            'crypto': 'cryptocurrency',
            'society': 'xã hội',
            'confession': 'tâm sự',
            'question': 'hỏi đáp',
            'random': 'random'
        };
        return categories[category] || category;
    }

    // Like a post
    async likePost(postId) {
        try {
            const result = this.storage.likePost(postId);
            
            if (result.success) {
                // Update UI
                const button = document.querySelector(`[data-post-id="${postId}"][data-action="like"]`);
                if (button) {
                    button.classList.add('liked');
                    const countSpan = button.querySelector('.like-count');
                    if (countSpan) {
                        countSpan.textContent = result.likes;
                    }
                    
                    // Visual feedback
                    button.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        button.style.transform = '';
                    }, 200);
                }
                
                this.updateStats();
            } else {
                this.showNotification('Bạn đã like bài viết này rồi!', 'warning');
            }
            
        } catch (error) {
            console.error('Failed to like post:', error);
            this.showNotification('Không thể like bài viết. Vui lòng thử lại.', 'error');
        }
    }

    // Show comments modal
    async showComments(postId) {
        this.currentPostId = postId;
        const post = this.storage.getPost(postId);
        
        if (!post) {
            this.showNotification('Không tìm thấy bài viết.', 'error');
            return;
        }
        
        this.renderPostPreview(post);
        this.loadCommentsForPost(postId);
        this.showModal('commentsModal');
    }

    // Render post preview in modal
    renderPostPreview(post) {
        const previewEl = document.getElementById('postPreview');
        const timeAgo = this.formatTimeAgo(post.timestamp);
        
        previewEl.innerHTML = `
            <div class="post-meta">
                <strong>${this.escapeHtml(post.anonId)}</strong>
                <span>${timeAgo}</span>
            </div>
            <h3>${this.escapeHtml(post.title)}</h3>
            <div class="post-content">${this.formatContent(post.content)}</div>
        `;
    }

    // Load comments for a post
    loadCommentsForPost(postId) {
        const post = this.storage.getPost(postId);
        if (!post) return;
        
        const commentsEl = document.getElementById('commentsList');
        
        if (!post.comments || post.comments.length === 0) {
            commentsEl.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px;">
                    <div style="font-size: 2rem; margin-bottom: 15px; opacity: 0.6;">💬</div>
                    <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                </div>
            `;
            return;
        }
        
        commentsEl.innerHTML = post.comments.map(comment => this.renderComment(comment)).join('');
        
        // Reset comment form
        document.getElementById('commentContent').value = '';
        document.getElementById('commentCounter').textContent = '0';
    }

    // Render single comment
    renderComment(comment) {
        const timeAgo = this.formatTimeAgo(comment.timestamp);
        
        return `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-anon-id">${this.escapeHtml(comment.anonId)}</span>
                    <span class="comment-timestamp">${timeAgo}</span>
                </div>
                <div class="comment-content">${this.formatContent(comment.content)}</div>
            </div>
        `;
    }

    // Update comment count in post
    updatePostCommentCount(postId) {
        const post = this.storage.getPost(postId);
        if (!post) return;
        
        const button = document.querySelector(`[data-post-id="${postId}"] .comment-count`);
        if (button) {
            button.textContent = post.comments?.length || 0;
        }
    }

    // Share post
    async sharePost(postId) {
        const post = this.storage.getPost(postId);
        if (!post) return;
        
        const shareData = {
            title: `AnonForum: ${post.title}`,
            text: post.content.substring(0, 100) + '...',
            url: `${window.location.origin}#post-${postId}`
        };
        
        try {
            if (navigator.share && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                this.showNotification('✅ Đã chia sẻ bài viết!', 'success');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.url);
                this.showNotification('🔗 Link đã được copy vào clipboard!', 'success');
            }
        } catch (error) {
            // Manual fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareData.url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showNotification('🔗 Link đã được copy!', 'success');
            } catch (fallbackError) {
                this.showNotification('Không thể chia sẻ. Vui lớng thử lại.', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    // Filter posts by category
    filterPosts(category) {
        this.currentCategory = category;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.loadPosts();
    }

    // Format timestamp to human readable
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        if (days < 30) return `${days} ngày trước`;
        
        return new Date(timestamp).toLocaleDateString('vi-VN');
    }

    // Format post/comment content
    formatContent(content) {
        if (!content) return '';
        
        // Escape HTML first
        let formatted = this.escapeHtml(content);
        
        // Convert URLs to links
        formatted = formatted.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: var(--primary);">$1</a>'
        );
        
        // Convert line breaks to <br>
        formatted = formatted.replace(/\n/g, '<br>');
        
        return formatted;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Show/hide create post form
    showCreatePostForm() {
        const form = document.getElementById('createPostForm');
        const toggle = document.querySelector('.create-post-toggle');
        
        if (form && toggle) {
            form.style.display = 'block';
            toggle.classList.add('active');
            document.getElementById('postTitle').focus();
        }
    }

    hideCreatePostForm() {
        const form = document.getElementById('createPostForm');
        const toggle = document.querySelector('.create-post-toggle');
        
        if (form && toggle) {
            form.style.display = 'none';
            toggle.classList.remove('active');
        }
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input if available
            const firstInput = modal.querySelector('input, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
        this.currentPostId = null;
    }

    // Notification system
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">×</button>
        `;
        
        container.appendChild(notification);
        
        // Auto-remove notification
        if (duration > 0) {
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateY(-20px)';
                    setTimeout(() => notification.remove(), 300);
                }
            }, duration);
        }
        
        return notification;
    }

    // Export data
    exportData() {
        try {
            const data = this.storage.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `anonforum-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            this.showNotification('📁 Dữ liệu đã được xuất thành công!', 'success');
        } catch (error) {
            console.error('Export failed:', error);
            this.showNotification('Không thể xuất dữ liệu. Vui lòng thử lại.', 'error');
        }
    }

    // Clear all data
    clearAllData() {
        if (!confirm('⚠️ Bạn có chắc muốn xóa toàn bộ dữ liệu? Hành động này không thể hoàn tác!')) {
            return;
        }
        
        if (!confirm('🗑️ Xác nhận lần cuối: XÓA TẤT CẢ dữ liệu?')) {
            return;
        }
        
        try {
            this.storage.clearAllData();
            this.clearFormDraft();
            
            // Refresh UI
            this.loadPosts();
            this.updateStats();
            
            this.showNotification('🗑️ Đã xóa toàn bộ dữ liệu!', 'success');
        } catch (error) {
            console.error('Clear data failed:', error);
            this.showNotification('Không thể xóa dữ liệu. Vui lòng thử lại.', 'error');
        }
    }

    // About modal functions
    showAbout() {
        this.showModal('aboutModal');
    }

    showPrivacyInfo() {
        const storageInfo = this.storage.getStorageInfo();
        this.showNotification(
            `🛡️ Quyền riêng tư: Dữ liệu chỉ lưu trên máy bạn (${storageInfo.used}KB/${storageInfo.total}KB). Không gửi server, không theo dõi.`,
            'info',
            8000
        );
    }

    showTechInfo() {
        this.showNotification(
            '💻 Công nghệ: Pure HTML/CSS/JavaScript + LocalStorage. Không backend, không database, hoạt động offline.',
            'info',
            8000
        );
    }

    // Close privacy notice
    closePrivacyNotice() {
        const notice = document.getElementById('privacyNotice');
        if (notice) {
            notice.style.opacity = '0';
            notice.style.transform = 'translateY(-20px)';
            setTimeout(() => notice.remove(), 300);
        }
    }
}

// Global functions for HTML event handlers
window.toggleCreatePost = function() {
    const form = document.getElementById('createPostForm');
    const toggle = document.querySelector('.create-post-toggle');
    
    if (form.style.display === 'none' || !form.style.display) {
        window.app.showCreatePostForm();
    } else {
        window.app.hideCreatePostForm();
    }
};

window.clearForm = function() {
    window.app.clearForm();
    window.app.clearFormDraft();
};

window.filterPosts = function(category) {
    window.app.filterPosts(category);
};

window.closeCommentsModal = function() {
    window.app.closeModal('commentsModal');
};

window.closeModal = function(modalId) {
    window.app.closeModal(modalId);
};

window.showAbout = function() {
    window.app.showAbout();
};

window.showPrivacyInfo = function() {
    window.app.showPrivacyInfo();
};

window.showTechInfo = function() {
    window.app.showTechInfo();
};

window.exportData = function() {
    window.app.exportData();
};

window.clearAllData = function() {
    window.app.clearAllData();
};

window.closePrivacyNotice = function() {
    window.app.closePrivacyNotice();
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.app = new AnonForum();
});

// Handle page unload
window.addEventListener('beforeunload', function() {
    // Save any pending drafts
    if (window.app) {
        window.app.saveFormDraft();
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnonForum;
}