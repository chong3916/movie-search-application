package edu.usc.csci310.project.demo.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.ExpressionUrlAuthorizationConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SecurityConfigurationTest {

    @Test
    public void filterChainTest() throws Exception {
        HttpSecurity mockHttp = mock(HttpSecurity.class);
        ExpressionUrlAuthorizationConfigurer.ExpressionInterceptUrlRegistry mockReg = mock(ExpressionUrlAuthorizationConfigurer.ExpressionInterceptUrlRegistry.class);
        ExpressionUrlAuthorizationConfigurer.AuthorizedUrl mockAuthUrl = mock(ExpressionUrlAuthorizationConfigurer.AuthorizedUrl.class);
        CorsConfigurer<HttpSecurity> mockCors = mock(CorsConfigurer.class);
        CsrfConfigurer<HttpSecurity> mockCsrf = mock(CsrfConfigurer.class);

        when(mockHttp.authorizeRequests()).thenReturn(mockReg);
        when(mockReg.anyRequest()).thenReturn(mockAuthUrl);
        when(mockHttp.cors()).thenReturn(mockCors);
        when(mockCors.and()).thenReturn(mockHttp);
        when(mockHttp.csrf()).thenReturn(mockCsrf);

        SecurityConfiguration securityConfiguration = new SecurityConfiguration();

        SecurityFilterChain result = securityConfiguration.filterChain(mockHttp);

        assertEquals(result, null);
    }

    @Test
    public void passwordEncoderTest() {
        SecurityConfiguration securityConfiguration = new SecurityConfiguration();
        BCryptPasswordEncoder encoder = securityConfiguration.passwordEncoder();
        assertNotNull(encoder);
    }
}
