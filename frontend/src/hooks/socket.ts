/* Socket hook */
import { useCallback, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = (
    documentId: string | null, 
    isEditMode: boolean,
    onTextChange?: (data: { html: string; _id: string }) => void
) => {
    const socketRef = useRef<Socket | null>(null); // Ref to hold the socket instance.

    useEffect(() => {
        // Connect to the socket server.
        socketRef.current = io('http://localhost:3001', {
            withCredentials: true
        });

        socketRef.current.on('connect', () => { // Log when connected.
            console.log('Connected to socket server');
            socketRef.current?.emit("create", documentId); // Join the document room.
        });

        // Listen for text changes if in edit mode.
        if (onTextChange) {
            socketRef.current.on('text-change', onTextChange);
        }

        socketRef.current.on('disconnect', () => { // Log when disconnected.
            console.log('Disconnected from socket server');
        });

        return () => {
            if (socketRef.current) {
                // Remove listener and disconnect on cleanup.
                if (onTextChange) {
                    socketRef.current.off('text-change', onTextChange);
                }
                socketRef.current.disconnect(); // Clean up on unmount.
            }
        };
    }, [documentId, isEditMode, onTextChange]);

    // Function for sending text changes to the server.
    const sendTextChange = useCallback((htmlContent: string) => {
        if (socketRef.current && documentId && isEditMode) {
            socketRef.current.emit("text-change", {
                _id: documentId,
                html: htmlContent
            });
        }
    }, [documentId, isEditMode]); // Dependencies for useCallback.

    // Function for leaving the document room.
    const leavingDoc = useCallback(() => {
        if (socketRef.current && documentId) {
            socketRef.current.emit("leave", documentId);
        }
    }, [documentId]);

    return {
        socket: socketRef.current, sendTextChange, leavingDoc
    };
};
