export const bubbleSort = (arr: number[]): number[][] => {
    const steps: number[][] = [arr.slice()];
    const n = arr.length;
  
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push(arr.slice());
        }
      }
    }
  
    return steps;
  };
  
  export const quickSort = (arr: number[]): number[][] => {
    const steps: number[][] = [arr.slice()];
  
    const partition = (low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;
  
      for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push(arr.slice());
        }
      }
  
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push(arr.slice());
      return i + 1;
    };
  
    const sort = (low: number, high: number) => {
      if (low < high) {
        const pi = partition(low, high);
        sort(low, pi - 1);
        sort(pi + 1, high);
      }
    };
  
    sort(0, arr.length - 1);
    return steps;
  };
  
  export const mergeSort = (arr: number[]): number[][] => {
    const steps: number[][] = [arr.slice()];
  
    const merge = (l: number, m: number, r: number) => {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = arr.slice(l, m + 1);
      const R = arr.slice(m + 1, r + 1);
  
      let i = 0, j = 0, k = l;
  
      while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        steps.push(arr.slice());
      }
  
      while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        steps.push(arr.slice());
      }
  
      while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        steps.push(arr.slice());
      }
    };
  
    const sort = (l: number, r: number) => {
      if (l < r) {
        const m = Math.floor(l + (r - l) / 2);
        sort(l, m);
        sort(m + 1, r);
        merge(l, m, r);
      }
    };
  
    sort(0, arr.length - 1);
    return steps;
  };
  
  export const insertionSort = (arr: number[]): number[][] => {
    const steps: number[][] = [arr.slice()];
  
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
  
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j--;
        steps.push(arr.slice());
      }
  
      arr[j + 1] = key;
      steps.push(arr.slice());
    }
  
    return steps;
  };