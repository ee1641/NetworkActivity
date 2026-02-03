package edu.rit.NetworkActivity.web.controller;


import edu.rit.NetworkActivity.data.entity.TestEntity;
import edu.rit.NetworkActivity.data.repository.TestRepository;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
public class TestController {
    private final TestRepository repo;

    public TestController(TestRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/tests")
    public String getTestsPage(Model model) {
        List<TestEntity> tests = repo.findAll();
        model.addAttribute("tests", tests);
        return "tests";
    }

    @GetMapping("/api/tests")
    @ResponseBody
    public List<TestEntity> getTestsApi() {
        return repo.findAll();
    }
}
