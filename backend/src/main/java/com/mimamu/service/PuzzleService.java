package com.mimamu.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mimamu.dto.GuessResponse;
import com.mimamu.dto.PuzzleResponse;
import com.mimamu.model.Puzzle;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PuzzleService {

    private final ObjectMapper objectMapper;

    @Value("classpath:puzzles/${mimamu.current-puzzle}.json")
    private Resource currentPuzzleResource;

    private Puzzle currentPuzzle;

    public PuzzleService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    private void loadPuzzles() throws IOException {
        currentPuzzle = objectMapper.readValue(currentPuzzleResource.getInputStream(), Puzzle.class);
    }

    public PuzzleResponse getCurrentPuzzleResponse() {
        List<Integer> lengths = currentPuzzle.words().stream()
                .map(String::length)
                .toList();

        return new PuzzleResponse(
                currentPuzzle().id(),
                currentPuzzle().imagePath(),
                lengths
        );
    }

    public Puzzle currentPuzzle() {
        return currentPuzzle;
    }

    public GuessResponse guessWord(String guess) {
        List<Integer> matchedIndexes = new ArrayList<>();

        String displayWord = "";

        if (guess == null || guess.isBlank()) {
            return new GuessResponse(
                    matchedIndexes,
                    displayWord
            );
        }

        guess = guess.trim();

        for (int index = 0; index < currentPuzzle().words().size(); index++) {

            if (currentPuzzle().words().get(index).equalsIgnoreCase(guess)) {
                matchedIndexes.add(index);
                displayWord = currentPuzzle().words().get(index);
            }
        }

        return new GuessResponse(
                matchedIndexes,
                displayWord
        );
    }
}
