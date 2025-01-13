#import "NotificationService.h"
#import <UserNotifications/UserNotifications.h>

@interface NotificationService () <UNUserNotificationCenterDelegate>
@property (nonatomic, strong) void (^contentHandler)(UNNotificationContent *contentToDeliver);
@property (nonatomic, strong) UNMutableNotificationContent *bestAttemptContent;
@end

@implementation NotificationService

- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    self.contentHandler = contentHandler;
    self.bestAttemptContent = [request.content mutableCopy];
    
    // Proses data notifikasi
    NSDictionary *userInfo = self.bestAttemptContent.userInfo;
    
    // Tambahkan kategori notifikasi
    if ([userInfo[@"type"] isEqualToString:@"achievement"]) {
        self.bestAttemptContent.categoryIdentifier = @"ACHIEVEMENT";
    } else if ([userInfo[@"type"] isEqualToString:@"reminder"]) {
        self.bestAttemptContent.categoryIdentifier = @"REMINDER";
    }
    
    // Tambahkan sound jika diperlukan
    if (userInfo[@"sound"]) {
        self.bestAttemptContent.sound = [UNNotificationSound soundNamed:userInfo[@"sound"]];
    }
    
    self.contentHandler(self.bestAttemptContent);
}

- (void)serviceExtensionTimeWillExpire {
    self.contentHandler(self.bestAttemptContent);
}

@end 