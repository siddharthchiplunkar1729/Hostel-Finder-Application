package com.hostelhub;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiSmokeTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void publicHostelsEndpointReturnsSeededData() {
        ResponseEntity<String> response = restTemplate.getForEntity("http://localhost:" + port + "/api/hostels", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("North Block");
        assertThat(response.getBody()).contains("Approved");
    }

    @Test
    void publicCommunitiesEndpointReturnsSeededData() {
        ResponseEntity<String> response = restTemplate.getForEntity("http://localhost:" + port + "/api/communities", String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("Hostel Sports Club");
    }

    @Test
    void adminHostelsEndpointRequiresAuthentication() {
        ResponseEntity<String> response = restTemplate.getForEntity("http://localhost:" + port + "/api/admin/hostels", String.class);

        assertThat(response.getStatusCode().is4xxClientError()).isTrue();
    }
}
