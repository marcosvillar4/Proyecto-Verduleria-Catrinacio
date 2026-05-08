package com.verduleria.catrinacio.service;

import com.verduleria.catrinacio.dto.request.LoginRequest;
import com.verduleria.catrinacio.dto.request.RegisterRequest;
import com.verduleria.catrinacio.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
