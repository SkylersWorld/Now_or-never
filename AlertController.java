package com.ceas.controller;

import com.ceas.model.Alert;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final List<Alert> activeAlerts = new ArrayList<>();

    // HTTP Endpoint to get all alerts on load
    @GetMapping
    public List<Alert> getAllAlerts() {
        return activeAlerts;
    }

    // WebSocket Endpoint: Receives report, broadcasts to all clients
    @MessageMapping("/report")
    @SendTo("/topic/alerts")
    public Alert reportIncident(Alert alert) {
        // In a real app, save to DB here
        if (alert.getReporterName().equals("Authority")) {
            // Auto-verify if from authority
             // alert.setVerified(true);
        }
        activeAlerts.add(alert);
        return alert;
    }
}
