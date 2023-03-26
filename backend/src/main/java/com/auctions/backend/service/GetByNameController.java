package com.auctions.backend.service;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/getbyname")
public class GetByNameController {
  
  @CrossOrigin(origins = "*")
  @GetMapping("/getbyname")
  public String getByName(@RequestParam(required = false) String body) {
    System.out.println("Request body: " + body);
    return "Puppa";
  }
}