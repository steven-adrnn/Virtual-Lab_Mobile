#import "BiometricModule.h"
#import <React/RCTLog.h>

@implementation BiometricModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(authenticate:(NSString *)promptMessage
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    LAContext *context = [[LAContext alloc] init];
    NSError *error = nil;
    
    if ([context canEvaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics error:&error]) {
        [context evaluatePolicy:LAPolicyDeviceOwnerAuthenticationWithBiometrics
                localizedReason:promptMessage
                        reply:^(BOOL success, NSError *error) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (success) {
                    resolve(@YES);
                } else {
                    reject(@"E_AUTHENTICATION_FAILED", @"Authentication failed", error);
                }
            });
        }];
    } else {
        reject(@"E_BIOMETRIC_NOT_AVAILABLE", @"Biometric authentication not available", error);
    }
}

@end