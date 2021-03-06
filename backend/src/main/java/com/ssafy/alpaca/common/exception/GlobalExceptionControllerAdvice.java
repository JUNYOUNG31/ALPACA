package com.ssafy.alpaca.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ServerErrorException;

import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice(basePackages = "com.ssafy.alpaca.api")
public class GlobalExceptionControllerAdvice {

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({IllegalArgumentException.class, FileConvertException.class})
    public ErrorResult illegalArgExHandler(Exception e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(UnAuthorizedException.class)
    public ErrorResult illegalAccessExHandler(UnAuthorizedException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(NoSuchElementException.class)
    public ErrorResult noSuchExHandler(NoSuchElementException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(NullPointerException.class)
    public ErrorResult nullPointerExHandler(NullPointerException e) {
        return new ErrorResult(e.getMessage());
    }

    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(ServerErrorException.class)
    public ErrorResult nullPointerExHandler(ServerErrorException e) {
        return new ErrorResult(e.getMessage());
    }

}
