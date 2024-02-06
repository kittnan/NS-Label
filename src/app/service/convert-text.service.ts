import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConvertTextService {
  constructor() {}

  async continueFiles(files: FileList) {
    let arr: any[] = [];
    for (let i = 0; i < files.length; i++) {
      arr.push(this.readFileContent(files[i]));
    }
    const res = await Promise.all(arr);
    return res.reduce((p: any, n: any) => {
      return p.concat(n);
    }, []);
  }

  readFileContent(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        reject('no file');
      }
      const reader: any = new FileReader();

      reader.onload = (e: any) => {
        const text = reader.result.toString();
        let splitText = text.split('\n');
        if (!splitText || splitText.length == 0) {
          reject('data not correct');
        }
        splitText = splitText.map((t: any) => t.split('\t'));
        if (!splitText || splitText.length == 0) {
          reject('data not correct');
        }
        const header = splitText.shift();
        const body = splitText;
        const a_obj = body.map((b: any, i: any) => {
          return this.loopObj(header, b);
        });
        if (!a_obj || a_obj.length == 0) {
          reject('data not correct');
        }
        resolve(a_obj);
      };
      reader.readAsText(file);
    });
  }
  loopObj(header: any[], body: any[]) {
    const newArr = header.map((h: any, i: number) => {
      const key = h;
      const obj: any = {};
      obj[key] = body[i];
      return obj;
    });
    const newObj = newArr.reduce((prev: any, now: any) => {
      return (prev = {
        ...prev,
        ...now,
      });
    }, {});
    return newObj;
  }
}
