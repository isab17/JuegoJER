package com.example.demo.model;

public record ChatMessage(int id, String text, String user) {

    public int getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getUsername(){
        return user;
    }
}
