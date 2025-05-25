

export type Note = {
  id: string; // FirestoreのドキュメントID
  userId: string;
  title?: string;
  content?: string;
  parentDocument?: string | null;
  createdAt: Date;
  updatedAt?: Date;
};

