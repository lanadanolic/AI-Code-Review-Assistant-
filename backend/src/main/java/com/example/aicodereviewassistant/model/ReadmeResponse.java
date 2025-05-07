package com.example.aicodereviewassistant.model;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ReadmeResponse {
    private String readmeContent;
    private String projectName;
    private String[] technologies;
    private String[] installationSteps;
    private String[] usageExamples;
    private String license;
    private String contactInfo;
} 