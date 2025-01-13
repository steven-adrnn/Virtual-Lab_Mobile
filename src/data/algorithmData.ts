export const algorithmData = {
    bubble: {
      title: 'Bubble Sort',
      description: 'Bubble Sort adalah algoritma pengurutan sederhana yang berulang kali melintasi daftar, membandingkan elemen yang berdekatan dan menukarnya jika mereka dalam urutan yang salah.',
      steps: [
        'Bandingkan elemen pertama dengan elemen kedua.',
        'Jika elemen pertama lebih besar, tukar posisinya.',
        'Lanjutkan ke pasangan berikutnya.',
        'Ulangi proses sampai tidak ada lagi pertukaran yang diperlukan.',
      ],
      complexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)',
      },
      code: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }`,
      illustration: 'https://your-domain.com/images/bubble-sort-detail.gif',
    },
    // Tambahkan data untuk algoritma lainnya
  };