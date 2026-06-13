package com.mimamu.controller;

import com.mimamu.dto.GuessRequest;
import com.mimamu.dto.GuessResponse;
import com.mimamu.dto.PuzzleResponse;
import com.mimamu.service.PuzzleService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/puzzle")
public class PuzzleController {

    private final PuzzleService puzzleService;

    public PuzzleController(PuzzleService puzzleService) {
        this.puzzleService = puzzleService;
    }

    @GetMapping("/current")
    public PuzzleResponse getCurrentPuzzle() {
        return puzzleService.getCurrentPuzzleResponse();
    }

    @PostMapping("/{puzzleId}/guess")
    public GuessResponse guessWord(
            @PathVariable String puzzleId,
            @RequestBody GuessRequest request
    ) {
        return puzzleService.guessWord(request.guess());
    }
}
