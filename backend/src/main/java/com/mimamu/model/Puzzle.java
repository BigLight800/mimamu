package com.mimamu.model;

import java.util.List;

public record Puzzle(
        String id,
        String imagePath,
        List<String> words
) {}
