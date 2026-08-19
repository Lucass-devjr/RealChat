import { messageRepository } from '@/repositories/message-repository';
import type { MessageType } from '@prisma/client';

export const messageService = {
  async send(data: {
    conversationId: string;
    senderId: string;
    content: string;
    type?: MessageType;
    fileUrl?: string;
    fileName?: string;
    replyToId?: string;
  }) {
    return messageRepository.create({
      conversationId: data.conversationId,
      senderId: data.senderId,
      content: data.content,
      type: data.type ?? 'TEXT',
      fileUrl: data.fileUrl,
      fileName: data.fileName,
      replyToId: data.replyToId,
    });
  },

  async edit(id: string, senderId: string, content: string) {
    const message = await messageRepository.findById(id);
    if (!message) throw new Error('Mensagem nao encontrada');
    if (message.senderId !== senderId) throw new Error('Sem permissao');
    return messageRepository.update(id, content);
  },

  async delete(id: string, senderId: string) {
    const message = await messageRepository.findById(id);
    if (!message) throw new Error('Mensagem nao encontrada');
    if (message.senderId !== senderId) throw new Error('Sem permissao');
    return messageRepository.softDelete(id);
  },
};
