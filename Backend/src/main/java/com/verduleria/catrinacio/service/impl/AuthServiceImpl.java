package com.verduleria.catrinacio.service.impl;

import com.verduleria.catrinacio.dto.request.LoginRequest;
import com.verduleria.catrinacio.dto.request.RegisterRequest;
import com.verduleria.catrinacio.dto.response.AuthResponse;
import com.verduleria.catrinacio.entity.Usuario;
import com.verduleria.catrinacio.exception.BadRequestException;
import com.verduleria.catrinacio.repository.UsuarioRepository;
import com.verduleria.catrinacio.security.JwtTokenProvider;
import com.verduleria.catrinacio.security.UserPrincipal;
import com.verduleria.catrinacio.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        log.info("Usuario autenticado: {}", userPrincipal.getEmail());

        return AuthResponse.builder()
                .token(jwt)
                .tipo("Bearer")
                .id(userPrincipal.getId())
                .nombre(userPrincipal.getNombre())
                .apellido(userPrincipal.getApellido())
                .email(userPrincipal.getEmail())
                .rol(userPrincipal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado: " + request.getEmail());
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Usuario.Rol.VENDEDOR)
                .activo(true)
                .build();

        usuarioRepository.save(usuario);
        log.info("Nuevo usuario registrado: {}", usuario.getEmail());

        // Auto-login
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(jwt)
                .tipo("Bearer")
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .build();
    }
}
