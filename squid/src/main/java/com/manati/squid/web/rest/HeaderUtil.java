package com.manati.squid.web.rest;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;

public class HeaderUtil {

    private static final Logger log = LoggerFactory.getLogger(tech.jhipster.web.util.HeaderUtil.class);

    private HeaderUtil() {}

    private static String applicationName = "squidApp";

    public static HttpHeaders createAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + applicationName + "-alert", message);

        try {
            headers.add("X-" + applicationName + "-params", URLEncoder.encode(param, StandardCharsets.UTF_8.toString()));
        } catch (UnsupportedEncodingException var5) {}

        return headers;
    }

    public static HttpHeaders createEntityCreationAlert(boolean isCustomMessage, String entityName, String customMessage, String param) {
        String message = "";
        if (!isCustomMessage) message = entityName + " se ha registrado correctamente."; else message = customMessage;
        return createAlert(message, param);
    }

    public static HttpHeaders createEntityUpdateAlert(boolean isCustomMessage, String entityName, String customMessage, String param) {
        String message = "";
        if (!isCustomMessage) message = entityName + " se ha actualizado correctamente."; else message = customMessage;
        return createAlert(message, param);
    }

    public static HttpHeaders createEntityDeletionAlert(boolean isCustomMessage, String entityName, String customMessage, String param) {
        String message = "";
        if (!isCustomMessage) message = entityName + " se ha eliminado correctamente."; else message = customMessage;
        return createAlert(message, param);
    }

    public static HttpHeaders createFailureAlert(
        String applicationName,
        boolean enableTranslation,
        String entityName,
        String errorKey,
        String defaultMessage
    ) {
        log.error("Error al procesar el recurso, {}", defaultMessage);
        String message = enableTranslation ? "error." + errorKey : defaultMessage;
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + applicationName + "-error", message);
        headers.add("X-" + applicationName + "-params", entityName);
        return headers;
    }
}
