package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.controller.*;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;
import java.util.concurrent.*;

@Service
public class UserService {

    private final List<User> users = new ArrayList<>();
    private Long idCounter = 1L;
    private static final String FILE_PATH = "users.txt";
    private final ConcurrentHashMap<String, Long> lastSeen = new ConcurrentHashMap<>();
    private List<String> disconnected= new ArrayList<>();

    public UserService() {
        loadUsersFromFile();
    }
    
    // Obtener todos los usuarios
    public List<User> getAllUsers() {
        return users;
    }
    // Actualiza el último visto de un usuario
    public void hasSeen(String username) {
        this.lastSeen.put(username, System.currentTimeMillis());
    }

    public void disconnectUser(String username) {
        this.disconnected.add(username);
        this.lastSeen.remove(username);
    }

    // Obtiene usuarios conectados desde el umbral especificado
    public List<String> connectedUsersSince(long threshold) {
        List<String> connected = new ArrayList<>();
        long currentTimeMillis = System.currentTimeMillis();
        for (var entry : this.lastSeen.entrySet()) {
            if (entry.getValue() > (currentTimeMillis - threshold) && !this.disconnected.contains(entry.getKey())) {
                connected.add(entry.getKey());
            }
        }
        return connected;
    }
    // Crear un nuevo usuario
    public User createUser(LoginInput input) {
        User user = new User();
        user.setPassword(input.getPassword());
        user.setUsername(input.getUsername());
        user.setId(idCounter++);
        user.setScore(0);
        users.add(user);
        hasSeen(input.getUsername());
        saveUsersToFile(); // Guarda los cambios en el archivo
        return user;
    }
    

    // Actualizar un usuario existente
    public User updateUser(String username, User updatedUser) {
        Optional<User> userOptional = users.stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
    
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setPassword(updatedUser.getPassword());
            existingUser.setScore(updatedUser.getScore());
            saveUsersToFile(); // Guarda los cambios en el archivo
            return existingUser;
        } else {
            throw new RuntimeException("Usuario no existe");
        }
    }
    
    public User getUserByName(String username){
        Optional<User> matchingUser = users.stream()
                .filter(user -> user.getUsername().equals(username))
                .findFirst();
        User user = matchingUser.get();
        return user;
    }
    
    public User getUserByLogin(String userName, String password) {
    	Optional<User> matchingUser = users.stream()
                .filter(user -> user.getUsername().equals(userName))
                .findFirst();
    	if(matchingUser.isPresent()) {
            User user = matchingUser.get();
            if(!user.getPassword().equals(password)) {
                throw new RuntimeException("Contraseña Incorrecta");
            }
            this.disconnected.remove(userName);
            hasSeen(userName);
    		return user;
    	}else {
    		throw new RuntimeException("Usuario no existe");
    	}
    }
    // Eliminar un usuario
    public void deleteUser(String username, String password) {
        users.removeIf(user ->
            user.getUsername().equalsIgnoreCase(username) &&
            user.getPassword().equals(password)
        );
        saveUsersToFile(); // Guarda los cambios en el archivo
    }
    

    private void saveUsersToFile() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH))) {
            for (User user : users) {
                writer.write(user.getId() + "," + user.getUsername() + "," + user.getPassword() + "," + user.getScore());
                writer.newLine();
            }
        } catch (IOException e) {
            throw new RuntimeException("Error saving users to file", e);
        }
    }
    
    private void loadUsersFromFile() {
        File file = new File(FILE_PATH);
        if (!file.exists()) {
            return;
        }
    
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split(",");
                if (parts.length == 4) {
                    Long id = Long.parseLong(parts[0]);
                    String username = parts[1];
                    String password = parts[2];
                    int score = Integer.parseInt(parts[3]);
    
                    User user = new User(id, username, password, score);
                    users.add(user);
    
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