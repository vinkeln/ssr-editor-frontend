/* Component for handling comments for the text editor */
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COMMENTS, CREATE_COMMENT,
     RESOLVE_COMMENT,DELETE_COMMENT } from '../graphQL/queries';
import { useSocket } from "../hooks/socket";
import type { Comment, GetCommentsResponse, CreateCommentResponse,
    ResolveCommentResponse, DeleteCommentResponse
 } from '../types/comment';

interface UseCommentHandlingProps {
    documentId: string;
    enabled?: boolean;
}

export const useCommentHandling = ({ documentId, enabled = true }: UseCommentHandlingProps) => {
    const [selectedLine, setSelectedLine] = useState<number | null>(null);
    const [newComment, setNewComment] = useState<string>('');
    
    const { socket } = useSocket(documentId, true);

    // GraphQL Queries.
    const { 
        data: commentsData, 
        loading: commentsLoading, 
        error: commentsError,
        refetch: refetchComments 
    } = useQuery(GET_COMMENTS, {
        variables: { documentId },
        skip: !enabled || !documentId,
        fetchPolicy: 'cache-and-network'
    });

    // GraphQL Mutations for comments.
    const [createCommentMutation] = useMutation(CREATE_COMMENT);
    const [resolveCommentMutation] = useMutation(RESOLVE_COMMENT);
    const [deleteCommentMutation] = useMutation(DELETE_COMMENT);

    const comments: Comment[] = 
    ((commentsData as unknown) as GetCommentsResponse)?.comments || [];

    useEffect(() => {
        if (!socket || !enabled) return;

        // Socket listeners for time updates.
                const handleNewComment = (comment: Comment) => {
                    if (comment.documentId === documentId) {
                        refetchComments();
                    }
                };
        
                const handleCommentResolved = () => {
                    refetchComments();
                };
        
                socket.on('new-comment', handleNewComment);
                socket.on('comment-resolved', handleCommentResolved);

        return () => {
            socket.off('new-comment', handleNewComment);
            socket.off('comment-resolved', handleCommentResolved);
        };
    }, [socket, documentId, enabled, refetchComments]);

    // Create a new comment.
    const createComment = async (lineNumber: number, content: string): Promise<Comment | null> => {
        try {
            const result = await createCommentMutation({
                variables: {
                    documentId,
                    lineNumber,
                    content
                }
            });

            const response = (result.data as unknown) as CreateCommentResponse;

            if (response.createComment) {
                if (socket) {
                    socket.emit('create-comment', {
                        documentId,
                        lineNumber,
                        content,
                        userId: response.createComment.userId,
                        userEmail: response.createComment.userEmail
                    });
                }
                return response.createComment;
            }
            return null;
        } catch (error) {
            console.error('Error creating comment:', error);
            throw error;
        }
    };

    const resolveComment = async (commentId: string, resolved: boolean): Promise<{ id: string; resolved: boolean } | null> => {
        try {
            const result = await resolveCommentMutation({
                variables: {
                    commentId,
                    resolved
                }
            });

            const response = (result.data as unknown) as ResolveCommentResponse;

            if (response.resolveComment) {
                if (socket) {
                    socket.emit('resolve-comment', {
                        commentId,
                        documentId,
                        resolved
                    });
                }
                return response.resolveComment;
            }
            return null;
        } catch (error) {
            console.error('Error resolving comment:', error);
            throw error;
        }
    };

    const deleteComment = async (commentId: string): Promise<{ id: string } | null> => {
        try {
            const result = await deleteCommentMutation({
                variables: { commentId }
            });

            const response = (result.data as unknown) as DeleteCommentResponse;

            if (response.deleteComment) {
                return response.deleteComment;
            }
            return null;
        } catch (error) {
            console.error('Error deleting comment:', error);
            throw error;
        }
    };

    // Submitting a new comment.
    const submitComment = async (): Promise<void> => {
        if (!newComment.trim() || selectedLine === null) return;
        try {
            await createComment(selectedLine, newComment);
            setNewComment('');
            setSelectedLine(null);
        } catch (error) {
            console.error('Error creating a comment:', error);
        }
    };

    const handleResolve = async (commentId: string, currentlyResolved: boolean): Promise<void> => {
        try {
            await resolveComment(commentId, !currentlyResolved);
        } catch (error) {
            console.error('Error resolving comment:', error);
        }
    };

    // Group comment by line number.
    const commentsByLine = comments.reduce((acc, comment) => {
        if (!acc[comment.lineNumber]) {
            acc[comment.lineNumber] = [];
        }
        acc[comment.lineNumber].push(comment);
        return acc;
    }, {} as Record<number, Comment[]>);

    return {
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
        refetchComments,
        hasComments: comments.length > 0
    };
}