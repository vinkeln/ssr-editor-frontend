interface Document {
    id: string;
    title: string;
    content: string;
    type?: 'text' | 'code';
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

export type DocumentType = 'text' | 'code';

export const mapTypeToEnum = (type: DocumentType) => {
  switch(type) {
    case 'text': return 'TEXT';
    case 'code': return 'CODE';
  }
};

export type { Document, SharedUser };