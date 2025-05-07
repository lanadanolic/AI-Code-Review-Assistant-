package com.example.aicodereviewassistant.controller;

import com.example.aicodereviewassistant.model.ReadmeRequest;
import com.example.aicodereviewassistant.model.ReadmeResponse;
import com.example.aicodereviewassistant.service.ReadmeGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/readme")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ReadmeController {
    private final ReadmeGeneratorService readmeGeneratorService;

    @PostMapping("/generate")
    public ResponseEntity<ReadmeResponse> generateReadme(@RequestBody ReadmeRequest request) {
        ReadmeResponse response = readmeGeneratorService.generateReadme(request);
        return ResponseEntity.ok(response);
    }
} 