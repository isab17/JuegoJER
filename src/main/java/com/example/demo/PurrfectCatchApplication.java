package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;



@SpringBootApplication
@EnableWebSocket
public class PurrfectCatchApplication implements WebSocketConfigurer{

	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(new WebsocketHandler(), "/ws").setAllowedOrigins("*");
		
	}
	
	@Bean
	public WebsocketHandler handler()
	{
		return new WebsocketHandler();
	}
	
	public static void main(String[] args) {
		SpringApplication.run(PurrfectCatchApplication.class, args);
	}

}
