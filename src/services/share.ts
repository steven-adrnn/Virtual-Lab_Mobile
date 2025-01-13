import Share from 'react-native-share';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const ShareService = {
  // Share teks biasa
  async shareText(message: string, title?: string) {
    try {
      await Share.open({
        message,
        title: title || 'Bagikan dari Virtual Lab',
      });
      return true;
    } catch (error) {
      console.error('Share error:', error);
      return false;
    }
  },

  // Share hasil quiz
  async shareQuizResult(score: number, totalQuestions: number) {
    const message = `Saya baru saja menyelesaikan quiz di Virtual Lab dengan skor ${score}/${totalQuestions}! 🎉`;
    return this.shareText(message, 'Hasil Quiz Virtual Lab');
  },

  // Share progress pembelajaran
  async shareLearningProgress(completedTopics: number, totalTopics: number) {
    const message = `Saya telah menyelesaikan ${completedTopics} dari ${totalTopics} topik di Virtual Lab! 📚`;
    return this.shareText(message, 'Progress Pembelajaran Virtual Lab');
  },

  // Share screenshot
  async shareScreenshot(uri: string) {
    try {
      const shareOptions = {
        title: 'Bagikan Screenshot',
        url: Platform.OS === 'ios' ? `file://${uri}` : uri,
        type: 'image/png',
      };

      await Share.open(shareOptions);
      return true;
    } catch (error) {
      console.error('Share screenshot error:', error);
      return false;
    }
  },

  // Share file PDF
  async sharePDF(fileName: string, fileUrl: string) {
    try {
      // Download file terlebih dahulu
      const localFile = `${RNFS.CachesDirectoryPath}/${fileName}.pdf`;
      
      await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: localFile,
      }).promise;

      const shareOptions = {
        title: 'Bagikan PDF',
        url: `file://${localFile}`,
        type: 'application/pdf',
      };

      await Share.open(shareOptions);
      return true;
    } catch (error) {
      console.error('Share PDF error:', error);
      return false;
    }
  },
};