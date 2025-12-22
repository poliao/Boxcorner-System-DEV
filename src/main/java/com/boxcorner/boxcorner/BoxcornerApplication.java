package com.boxcorner.boxcorner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories
public class BoxcornerApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoxcornerApplication.class, args);
	}

}
