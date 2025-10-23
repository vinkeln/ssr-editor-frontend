/* Comment system component to handle displaying and interacting with comments */
import React from 'react';
import { useCommentHandling } from './CommentHandling';
import type { CommentSystemProps } from '../types/comment';

const CommentSystem: React.FC<CommentSystemProps> = ({ documentId, documentContent }) => {
    const {
        comments,
        commentsByLine,
        selectedLine,
        newComment,
        commentsLoading,
        commentsError,
        setSelectedLine,
        setNewComment,
        submitComment,
        handleResolve,
        deleteComment,
        hasComments
    } = useCommentHandling({ documentId });

    const lines = documentContent.split('\n').filter(line => line.trim() !== '');

    const handleLineClick = (lineIndex: number) => { // Fixed parameter name
        setSelectedLine(lineIndex);
    };

    const handleCancelComment = () => {
        setSelectedLine(null);
        setNewComment('');
    };

    if (commentsLoading) {
        return (
            <div className="comment-system">
                <div className="comment-loading">Loading comments...</div>
            </div>
        );
    }

    if (commentsError) {
        return (
            <div className="comment-system">
                <div className="comment-error">Error loading comments: {commentsError.message}</div>
            </div>
        );
    }

    return (
        <div className="comment-system">
            <div className="comment-system-header"> {/* Fixed typo: classNamne -> className */}
                <h3>Comments</h3>
                <div className="comment-stats">
                    {hasComments && (
                        <span className="unresolved-count">
                            {comments.filter(c => !c.resolved).length} unresolved Comment{comments.filter(c => !c.resolved).length !== 1 ? 's' : ''} {/* Added plural handling */}
                        </span>
                    )}
                </div>
            </div>

            <div className="document-comments">
                <h4>Document Lines</h4>
                <div className="document-lines">
                    {lines.map((line, index) => {
                        const lineComments = commentsByLine[index] || [];
                        const unresolvedCount = lineComments.filter(c => !c.resolved); // This should be an array

                        return ( // Added return statement
                            <div
                                key={index} // Fixed spacing
                                className={`document-line ${selectedLine === index ? 'line-selected' : ''} ${unresolvedCount.length > 0 ? 'line-has-comments' : ''}`} // Fixed template string
                                onClick={() => handleLineClick(index)}
                            >
                                <span className="line-number">{index + 1}</span>
                                <div className="line-content" dangerouslySetInnerHTML={{ __html: line }} />
                                {unresolvedCount.length > 0 && (
                                    <span className="comment-indicator">
                                        💬 ({unresolvedCount.length}) {/* Added icon */}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedLine !== null && (
                <div className="comment-input-section">
                    <div className="comment-input-header">
                        <h4>Add Comment to Line {selectedLine + 1}</h4>
                        <button className="cancel-comment-button" onClick={handleCancelComment}>
                            × {/* Better close icon */}
                        </button>
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment here..."
                        rows={4}
                        className="comment-textarea"
                        autoFocus
                    />
                    <div className="comment-input-actions">
                        <button
                            onClick={submitComment}
                            className="submit-comment-button"
                            disabled={!newComment.trim()}
                        >
                            Add Comment
                        </button>
                        <button
                            onClick={handleCancelComment}
                            className="cancel-comment-button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="comments-list">
                <div className="comments-list-header">
                    <h4>All Comments</h4>
                    {comments.length === 0 && <p className="no-comments">No comments yet.</p>} {/* Fixed spacing */}
                </div>

                {comments.length > 0 && ( 
                    <div className="comments-container">
                        {comments.map(comment => (
                            <div key={comment.id} className={`comment-item ${comment.resolved ? 'comment-resolved' : ''}`}>
                                <div className="comment-header">
                                    <div className="comment-meta">
                                        <span className="comment-author">{comment.userEmail}</span>
                                        <span className="comment-line-number">on line {comment.lineNumber + 1}</span>
                                        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div className="comment-status">
                                        {comment.resolved ? (
                                            <span className="status-resolved">Resolved</span>
                                        ) : (
                                            <span className="status-unresolved">Unresolved</span>
                                        )}
                                    </div>
                                </div>

                                <p className="comment-content">{comment.content}</p>
                                <div className="comment-actions">
                                    <button
                                        onClick={() => handleResolve(comment.id, comment.resolved)}
                                        className={`button-small ${comment.resolved ? "button-warning" : "button-success"}`}
                                    >
                                        {comment.resolved ? 'Reopen' : 'Resolve'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this comment?')) {
                                                deleteComment(comment.id);
                                            }
                                        }}
                                        className="button-small button-danger"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentSystem;