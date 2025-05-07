package com.example.aicodereviewassistant.model;

import lombok.Data;

@Data
public class ReadmeRequest {
    private String gitUrl;
    private String zipFileBase64;
    private String projectName;
    private String description;
} 