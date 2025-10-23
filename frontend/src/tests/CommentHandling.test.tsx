import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { ApolloClient, InMemoryCache } from '@apollo/client'; // imports ApolloClient, InMemoryCache for setting up mock Apollo Client
import { ApolloProvider } from '@apollo/client/react';
import { MockLink } from '@apollo/client/testing';
import { useCommentHandling } from '../components/CommentHandling';
import { GET_COMMENTS } from '../graphQL/queries';
import type { ReactNode } from 'react';


// Mock socket hook.
vi.mock('../hooks/socket', () => ({
  useSocket: () => ({
    socket: null,
  }),
}));

const mockComments = [
  {
    id: '1',
    documentId: 'test-doc-id',
    lineNumber: 0,
    content: 'Test comment',
    userId: 'user1',
    userEmail: 'test@example.com',
    createdAt: new Date().toISOString(),
    resolved: false,
    __typename: 'Comment'
  },
];

describe('useCommentHandling', () => {
  let mockLink: MockLink;
  let client: ApolloClient;

  beforeEach(() => {
    vi.clearAllMocks();

    mockLink = new MockLink([
      {
        request: {
          query: GET_COMMENTS,
          variables: { documentId: 'test-doc-id' },
        },
        result: {
          data: {
            comments: mockComments,
          },
        },
      },
    ]);

    client = new ApolloClient({
      link: mockLink,
      cache: new InMemoryCache(),
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>
      {children}
    </ApolloProvider>
  );

  it('Empty selected line and comment', () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    expect(result.current.selectedLine).toBeNull();
    expect(result.current.newComment).toBe('');
  });

  it('Loads comments from GraphQL', async () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.comments).toHaveLength(1);
      expect(result.current.comments[0].content).toBe('Test comment');
    }, { timeout: 3000 });
  });

  it('Sets selected line', () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    act(() => {
      result.current.setSelectedLine(5);
    });
    
    expect(result.current.selectedLine).toBe(5);
  });

  it('Sets new comment text', () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    act(() => {
      result.current.setNewComment('New comment text');
    });
    expect(result.current.newComment).toBe('New comment text');
  });

  it('Roups comments by line number', async () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.commentsByLine[0]).toBeDefined();
      expect(result.current.commentsByLine[0]).toHaveLength(1);
      expect(result.current.commentsByLine[0][0].content).toBe('Test comment');
    }, { timeout: 3000 });
  });

  it('Returns hasComments as true when comments exist', async () => {
    const { result } = renderHook(
      () => useCommentHandling({ documentId: 'test-doc-id' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.hasComments).toBe(true);
    }, { timeout: 3000 });
  });
});
