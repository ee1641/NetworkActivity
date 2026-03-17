package edu.rit.NetworkActivity.service;

import org.junit.jupiter.api.Test;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.Field;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifies that VeChainThorClient configures meaningful timeouts on its
 * RestTemplate so a slow or down thor-sdk never hangs the collector thread.
 */
class VeChainThorClientTimeoutTest {

    @Test
    void restTemplateHasConnectionAndReadTimeouts() throws Exception {
        VeChainThorClient client = new VeChainThorClient();

        // Extract the RestTemplate via reflection
        Field rtField = VeChainThorClient.class.getDeclaredField("restTemplate");
        rtField.setAccessible(true);
        RestTemplate rt = (RestTemplate) rtField.get(client);

        assertThat(rt.getRequestFactory()).isInstanceOf(SimpleClientHttpRequestFactory.class);

        SimpleClientHttpRequestFactory factory = (SimpleClientHttpRequestFactory) rt.getRequestFactory();

        Field connField = SimpleClientHttpRequestFactory.class.getDeclaredField("connectTimeout");
        connField.setAccessible(true);
        int connectTimeout = (int) connField.get(factory);

        Field readField = SimpleClientHttpRequestFactory.class.getDeclaredField("readTimeout");
        readField.setAccessible(true);
        int readTimeout = (int) readField.get(factory);

        assertThat(connectTimeout).isEqualTo(5_000);
        assertThat(readTimeout).isEqualTo(10_000);
    }
}
