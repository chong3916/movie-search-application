package edu.usc.csci310.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

//@ComponentScan(basePackages = {"edu.usc.csci310.project.demo.db.repository"})
@Controller
@ComponentScan("edu.usc.csci310.project.demo")
@EntityScan("edu.usc.csci310.project.demo.db.model")
@EnableJpaRepositories("edu.usc.csci310.project.demo.db.repository")
@SpringBootApplication
public class SpringBootAPI {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootAPI.class, args);
    }

    @RequestMapping(value = {"{_:^(?!index\\.html|api).*$}", "/search/{searchVal}", "/search/{searchCategory}/{searchVal}", "/search/{searchCategory}/{searchVal}/{searchStartYear}", "/search/{searchCategory}/{searchVal}/{searchStartYear}/{searchEndYear}", "/movie/{movieId}", "/keyword/{searchVal}/{searchStartYear}/{searchEndYear}", "/keyword/{searchVal}", "/lists/privacy", "/lists/rename", "/movie/list"})
    public String redirect() {
        // Forward to home page so that route is preserved.(i.e forward:/index.html)
        return "forward:/";
    }
}
