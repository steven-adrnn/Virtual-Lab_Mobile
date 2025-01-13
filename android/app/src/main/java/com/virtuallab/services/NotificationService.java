package com.svirtuallab.services;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.virtuallab.MainActivity;
import com.virtuallab.R;

public class NotificationService extends FirebaseMessagingService {
    private static final String CHANNEL_ID = "virtual-lab-default";
    
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        
        // Handle data payload
        if (remoteMessage.getData().size() > 0) {
            handleDataMessage(remoteMessage.getData());
        }

        // Handle notification payload
        if (remoteMessage.getNotification() != null) {
            showNotification(
                remoteMessage.getNotification().getTitle(),
                remoteMessage.getNotification().getBody()
            );
        }
    }

    private void handleDataMessage(Map<String, String> data) {
        String type = data.get("type");
        String title = data.get("title");
        String message = data.get("message");
        
        if (type != null && type.equals("achievement")) {
            showAchievementNotification(title, message);
        } else {
            showNotification(title, message);
        }
    }

    private void showNotification(String title, String message) {
        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(message)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .setPriority(NotificationCompat.PRIORITY_HIGH);

        NotificationManager manager = 
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            
        if (manager != null) {
            manager.notify(0, builder.build());
        }
    }

    private void showAchievementNotification(String title, String message) {
        // Custom notification untuk achievement
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_achievement)
            .setContentTitle("🎉 " + title)
            .setContentText(message)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ACHIEVEMENT);

        NotificationManager manager = 
            (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            
        if (manager != null) {
            manager.notify(1, builder.build());
        }
    }

    @Override
    public void onNewToken(String token) {
        // Handle new FCM token
        sendRegistrationToServer(token);
    }

    private void sendRegistrationToServer(String token) {
        // Implement token update to your server
    }
} 