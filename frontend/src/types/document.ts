interface Document {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    userId: string;
    sharedWith?: SharedUser[];
    isOwner?: boolean;
    ownerName?: string;
}

interface SharedUser {
  userId: string;
  email: string;
  permission: 'view' | 'edit';
  sharedAt: string;
  status: 'pending' | 'accepted'; // pending = invitation not accepted yet.
}

export type { Document, SharedUser };