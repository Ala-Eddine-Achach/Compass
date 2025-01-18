import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { Readable } from 'stream';
import * as csv from 'csv-parser';

@Injectable()
export class FileUploadService {
  async uploadCSVFile(file: Express.Multer.File): Promise<any[]> {
    try {
      return new Promise((resolve, reject) => {
        const results = [];
        const fileStream = new Readable();
        fileStream.push(file.buffer);
        fileStream.push(null);
        fileStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            resolve(results);
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folderPath: string,
  ): Promise<{ url: string }> {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = file.originalname.split('.').pop();
      const filename = `${folderPath}/${uniqueSuffix}.${ext}`;
      const filePath = join(__dirname, '..', 'uploads', filename);

      // Ensure the directory exists
      const fs = require('fs');
      const dir = join(__dirname, '..', 'uploads', folderPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save the file to the local filesystem
      const fileStream = createWriteStream(filePath);
      fileStream.write(file.buffer);
      fileStream.end();

      // Return the URL to access the file
      const fileUrl = `/uploads/${filename}`;
      return { url: fileUrl };
    } catch (error) {
      console.error('Error occurred during file upload:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }
}