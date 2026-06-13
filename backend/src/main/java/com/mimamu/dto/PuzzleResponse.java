package com.mimamu.dto;

import java.util.List;

public record PuzzleResponse(
        String id,
        String imagePath,
        List<Integer> lengths
) {}
