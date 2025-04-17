package com.example.demo.service;

import com.example.demo.model.*;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class ChatService {
    private final List<ChatMessage> chat = new ArrayList<>();
    private int idCounter = 1;
    private static final String FILE_PATH = "chat.txt";
    private boolean LOAD_ON_START =false;
    public ChatService(){
        if(LOAD_ON_START){
            loadChatFromFile();
        }else{
            clearChat();
            LOAD_ON_START = true;
        }
    }

    public void addChatToFile(ChatMessage newChat){
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH,true))) {
            writer.write(newChat.getId() + "," + newChat.getUsername()+","+newChat.getText());
            writer.newLine();
        } catch (IOException e) {
            throw new RuntimeException("Error saving users to file", e);
        }
        chat.add(newChat);
    }

    public List<ChatMessage> getAllChat(){
        return chat;
    }
    public ChatMessage getChatById(int i){
        return chat.get(i);
    }
    public void clearChat() {
        // Limpia la lista en memoria
        chat.clear();
    
        // Elimina el archivo si existe
        File file = new File(FILE_PATH);
        if (file.exists()) {
            if (!file.delete()) {
                throw new RuntimeException("No se pudo borrar el archivo de chat");
            }
        }
    }
    
/* *
    private void saveChatToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (ChatMessage c : chat) {
                writer.write(c.getId() + "," + c.getUsername()+","+c.getText());
                writer.newLine();
            }
        } catch (IOException e) {
            throw new RuntimeException("Error saving users to file", e);
        }
    }
/* */
    private void loadChatFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            return;
        }
    
        try (BufferedReader reader = new BufferedReader(new FileReader(FILE_PATH))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",",3);
                if (parts.length == 3) {
                    int id = Integer.parseInt(parts[0]);
                    String text = parts[1];
                    String user = parts[2];

                    ChatMessage c = new ChatMessage(id, text, user);
                    chat.add(c);
    
                    if (id >= idCounter) {
                        idCounter = id + 1;
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Error loading users from file", e);
        }
    }

}
