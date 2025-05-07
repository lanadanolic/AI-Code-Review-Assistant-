package com.example.aicodereviewassistant.service;

import com.example.aicodereviewassistant.model.ReadmeRequest;
import com.example.aicodereviewassistant.model.ReadmeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class ReadmeGeneratorService {
    @Value("${spring.ai.openai.api-key}")
    private String apiKey;
    @Value("${spring.ai.openai.base-url}")
    private String baseUrl;
    @Value("${spring.ai.openai.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public ReadmeResponse generateReadme(ReadmeRequest request) {
        String prompt = buildPrompt(request);

        String url = baseUrl + "/chat/completions";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("HTTP-Referer", "http://localhost:3000"); // OpenRouter requires this
        headers.set("X-Title", "AI Code Review Assistant"); // OpenRouter requires this

        String body = "{" +
                "\"model\": \"" + model + "\"," +
                "\"messages\": [{\"role\": \"user\", \"content\": " + toJson(prompt) + "}]," +
                "\"temperature\": 0.7" +
                "}";

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

        String content = extractContentFromOpenAIResponse(response.getBody());
        return ReadmeResponse.builder()
                .readmeContent(content)
                .projectName(request.getProjectName())
                .build();
    }

    private String buildPrompt(ReadmeRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a comprehensive README.md for the following project:\n\n");
        prompt.append("Project Name: ").append(request.getProjectName()).append("\n");
        if (request.getDescription() != null) {
            prompt.append("Description: ").append(request.getDescription()).append("\n");
        }
        prompt.append("\nPlease include:\n");
        prompt.append("1. Project overview\n");
        prompt.append("2. Technologies used\n");
        prompt.append("3. Installation instructions\n");
        prompt.append("4. Usage examples\n");
        prompt.append("5. License information\n");
        prompt.append("6. Contact information\n\n");
        if (request.getGitUrl() != null) {
            prompt.append("Git Repository: ").append(request.getGitUrl()).append("\n");
        }
        return prompt.toString();
    }

    private String toJson(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n") + "\"";
    }

    private String extractContentFromOpenAIResponse(String responseBody) {
        // Simple extraction for OpenAI-like response
        // You may want to use a JSON library for robustness
        if (responseBody == null) return "";
        int idx = responseBody.indexOf("\"content\":");
        if (idx == -1) return responseBody;
        int start = responseBody.indexOf('"', idx + 10) + 1;
        int end = responseBody.indexOf('"', start);
        if (start == 0 || end == -1) return responseBody;
        return responseBody.substring(start, end).replace("\\n", "\n");
    }
} 