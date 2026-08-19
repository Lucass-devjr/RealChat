import { ChatSidebar } from '@/components/chat-sidebar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
