package com.liga1pro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class Liga1proBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(Liga1proBackendApplication.class, args);
	}

}
