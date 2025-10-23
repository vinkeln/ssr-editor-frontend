interface Comment {
    id: string;
    documentId: string;
    lineNumber: number;
    content: string;
    userId: string;
    userEmail: string;
    createdAt: string;
    resolved: boolean;
}

interface CommentSystemProps {
    documentId: string;
    documentContent: string;
    userId: string;
    userEmail: string;
}

export interface GetCommentsResponse {
    comments: Comment[];
}

export interface CreateCommentResponse {
    createComment: Comment;
}

export interface ResolveCommentResponse {
    resolveComment: {
        id: string;
        resolved: boolean;
    };
}

export interface DeleteCommentResponse {
    deleteComment: {
        id: string;
    };
}

export type { Comment, CommentSystemProps };