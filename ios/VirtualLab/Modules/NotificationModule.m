#import "NotificationModule.h"
#import <React/RCTLog.h>
#import <UserNotifications/UserNotifications.h>

@implementation NotificationModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestPermission:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    UNAuthorizationOptions options = UNAuthorizationOptionAlert + 
                                   UNAuthorizationOptionSound + 
                                   UNAuthorizationOptionBadge;
    
    [center requestAuthorizationWithOptions:options
                        completionHandler:^(BOOL granted, NSError * _Nullable error) {
        if (error) {
            reject(@"permission_error", @"Failed to request permission", error);
        } else {
            resolve(@(granted));
        }
    }];
}

RCT_EXPORT_METHOD(scheduleLocalNotification:(NSDictionary *)notification
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
    content.title = notification[@"title"];
    content.body = notification[@"message"];
    content.sound = [UNNotificationSound defaultSound];
    
    if (notification[@"data"]) {
        content.userInfo = notification[@"data"];
    }
    
    NSNumber *timestamp = notification[@"timestamp"];
    NSDate *date = [NSDate dateWithTimeIntervalSince1970:[timestamp doubleValue]];
    NSCalendar *calendar = [NSCalendar currentCalendar];
    NSDateComponents *components = [calendar components:(NSCalendarUnitYear +
                                                       NSCalendarUnitMonth +
                                                       NSCalendarUnitDay +
                                                       NSCalendarUnitHour +
                                                       NSCalendarUnitMinute +
                                                       NSCalendarUnitSecond)
                                             fromDate:date];
    
    UNCalendarNotificationTrigger *trigger = [UNCalendarNotificationTrigger 
                                            triggerWithDateMatchingComponents:components
                                            repeats:NO];
    
    NSString *identifier = notification[@"id"] ?: [[NSUUID UUID] UUIDString];
    UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:identifier
                                                                        content:content
                                                                        trigger:trigger];
    
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
        if (error) {
            reject(@"notification_error", @"Failed to schedule notification", error);
        } else {
            resolve(@{@"id": identifier});
        }
    }];
}

RCT_EXPORT_METHOD(cancelAllNotifications:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center removeAllPendingNotificationRequests];
    [center removeAllDeliveredNotifications];
    resolve(@(YES));
}

@end