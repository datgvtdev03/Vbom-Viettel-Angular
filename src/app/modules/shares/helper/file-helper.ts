export class FileHelper {
    static downloadFile(file: Blob, filename: string): void {
        const blob = new Blob([file], { type: 'application/octet-stream' });
        var link = document.createElement('a');
        document.body.appendChild(link);
        link.href = window.URL.createObjectURL(blob)
        link.setAttribute('download', filename);
        link.click();
        document.body.removeChild(link);
    }

    static getContentWithoutImage(content: string): string {
        let searchContentStr = content;
        let output = '';
        let startIndex, endIndex;
        while (searchContentStr.indexOf('<img src') > -1) {
          startIndex = searchContentStr.indexOf('<img src');
          endIndex = searchContentStr.indexOf('>');
          output += searchContentStr.slice(0, startIndex);
          searchContentStr = searchContentStr.slice(startIndex);
          searchContentStr = searchContentStr.slice(searchContentStr.indexOf('>') + 1);
        }
        output += searchContentStr;
        return output;
    }
}
