package edu.rit.NetworkActivity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class NetworkActivityApplication {

	public static void main(String[] args) {
		SpringApplication.run(NetworkActivityApplication.class, args);
	}

}
