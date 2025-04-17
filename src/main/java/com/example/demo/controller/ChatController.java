package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.ChatService;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    //Chat
    //private final List<ChatMessage> messages = new ArrayList<>();
    private final AtomicInteger lastId = new AtomicInteger(0);

    @Autowired
    private ChatService chatService;

    @GetMapping()
    public ChatResponse getMessages(@RequestParam(defaultValue = "0") int since) {
        
        List<ChatMessage> newMessages = new ArrayList<>();
        List<ChatMessage> messages = chatService.getAllChat();
        int latestId = since;

        synchronized (messages) {
            for (ChatMessage msg : messages) {
                if (msg.getId() > since) {
                    newMessages.add(new ChatMessage(msg.getId(), msg.getText(),msg.getUsername()));

                    latestId = msg.getId();
                }
            }
        }/* */

        return new ChatResponse(newMessages, latestId);
    }

    @GetMapping("/AllMessage")
    public List<ChatMessage> getAllMessages() {
        return chatService.getAllChat();
    }


    @PostMapping
    public ChatMessage postMessage(@RequestParam String message, @RequestParam String username) {
    ChatMessage newMessage = new ChatMessage(lastId.incrementAndGet(), message, username);
    chatService.addChatToFile(newMessage);
    return newMessage; // Devuelve el mensaje recién creado
}

    
/* ESTO FUNCIONA
@PostMapping
public void postMessage(@RequestParam String message, @RequestParam String username) {
    
    System.out.println("Mensaje recibido: " + message);
    System.out.println("Usuario recibido: " + username);
    

    chatService.addChatToFile(new ChatMessage(lastId.incrementAndGet(), message, username));
}
*/
    public static class ChatResponse {
        private final List<ChatMessage> messages;
        private final int timestamp;

        public ChatResponse(List<ChatMessage> messages, int timestamp) {
            this.messages = messages;
            this.timestamp = timestamp;
        }

        public List<ChatMessage> getMessages() {
            return messages;
        }

        public int getTimestamp() {
            return timestamp;
        }
    }
}
