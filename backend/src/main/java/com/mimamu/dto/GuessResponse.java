package com.mimamu.dto;

import java.util.List;

public record GuessResponse(
        List<Integer> matchedIndexes,
        String displayWord
) {}
