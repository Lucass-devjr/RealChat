import { MessageCircle } from 'lucide-react';

export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <MessageCircle className="mb-4 h-16 w-16 text-muted-foreground" />
      <h2 className="text-xl font-semibold">RealChat</h2>
      <p className="mt-2 text-muted-foreground">Selecione uma conversa para comecar</p>
    </div>
  );
}
