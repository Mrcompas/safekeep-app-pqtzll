
import * as FileSystem from 'expo-file-system';
import { documentDirectory } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Item, BackupData } from '../types/item';
import { Platform } from 'react-native';

const APP_VERSION = '1.0.0';

export const exportToCSV = async (items: Item[]): Promise<string> => {
  try {
    const headers = [
      'Product Name',
      'Purchase Date',
      'Warranty Length (months)',
      'Store Name',
      'Status',
      'Days Remaining',
      'Price',
      'Created At'
    ].join(',');

    const rows = items.map(item => {
      const purchaseDate = new Date(item.purchaseDate);
      const expirationDate = new Date(purchaseDate);
      expirationDate.setMonth(expirationDate.getMonth() + item.warrantyLength);
      
      const today = new Date();
      const daysRemaining = Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      let status = 'Active';
      if (daysRemaining <= 0) status = 'Expired';
      else if (daysRemaining <= 30) status = 'Expiring';

      return [
        `"${item.productName.replace(/"/g, '""')}"`,
        purchaseDate.toISOString().split('T')[0],
        item.warrantyLength,
        `"${item.storeName.replace(/"/g, '""')}"`,
        status,
        daysRemaining,
        item.price || '',
        new Date(item.createdAt).toISOString().split('T')[0]
      ].join(',');
    });

    const csvContent = [headers, ...rows].join('\n');
    
    const fileName = `SafeKeep_Export_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = `${documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: 'utf8',
    });

    console.log('CSV export created:', fileUri);
    return fileUri;
  } catch (error) {
    console.log('Error exporting to CSV:', error);
    throw error;
  }
};

export const exportToPDF = async (items: Item[]): Promise<string> => {
  try {
    // For PDF export, we'll create a simple HTML that can be converted to PDF
    // In a production app, you might use a library like react-native-html-to-pdf
    
    const htmlContent = generatePDFHTML(items);
    const fileName = `SafeKeep_Export_${new Date().toISOString().split('T')[0]}.html`;
    const fileUri = `${documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
      encoding: 'utf8',
    });

    console.log('PDF export created:', fileUri);
    return fileUri;
  } catch (error) {
    console.log('Error exporting to PDF:', error);
    throw error;
  }
};

const generatePDFHTML = (items: Item[]): string => {
  const today = new Date().toLocaleDateString();
  
  const itemRows = items.map(item => {
    const purchaseDate = new Date(item.purchaseDate);
    const expirationDate = new Date(purchaseDate);
    expirationDate.setMonth(expirationDate.getMonth() + item.warrantyLength);
    
    const daysRemaining = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    let status = 'Active';
    let statusColor = '#10B981';
    if (daysRemaining <= 0) {
      status = 'Expired';
      statusColor = '#EF4444';
    } else if (daysRemaining <= 30) {
      status = 'Expiring';
      statusColor = '#F59E0B';
    }

    return `
      <tr>
        <td>${item.productName}</td>
        <td>${purchaseDate.toLocaleDateString()}</td>
        <td>${item.warrantyLength} months</td>
        <td>${item.storeName}</td>
        <td style="color: ${statusColor}; font-weight: bold;">${status}</td>
        <td>${daysRemaining > 0 ? `${daysRemaining} days` : `${Math.abs(daysRemaining)} days ago`}</td>
        <td>${item.price ? `$${item.price.toFixed(2)}` : '-'}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>SafeKeep Warranty Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .date { color: #6B7280; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #E5E7EB; padding: 12px; text-align: left; }
        th { background-color: #F9FAFB; font-weight: bold; }
        .summary { margin-bottom: 20px; padding: 15px; background-color: #F0F9FF; border-radius: 8px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">🛡️ SafeKeep</div>
        <div class="date">Warranty Export - ${today}</div>
      </div>
      
      <div class="summary">
        <strong>Summary:</strong> ${items.length} items tracked
      </div>
      
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Purchase Date</th>
            <th>Warranty Length</th>
            <th>Store</th>
            <th>Status</th>
            <th>Days Remaining</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
    </body>
    </html>
  `;
};

export const shareExportFile = async (fileUri: string): Promise<void> => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: fileUri.endsWith('.csv') ? 'text/csv' : 'text/html',
        dialogTitle: 'Share SafeKeep Export',
      });
    } else {
      throw new Error('Sharing is not available on this device');
    }
  } catch (error) {
    console.log('Error sharing export file:', error);
    throw error;
  }
};

export const createBackup = async (items: Item[]): Promise<BackupData> => {
  try {
    const backupData: BackupData = {
      items,
      exportDate: new Date(),
      version: APP_VERSION,
    };

    const fileName = `SafeKeep_Backup_${new Date().toISOString().split('T')[0]}.json`;
    const fileUri = `${documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(backupData, null, 2), {
      encoding: 'utf8',
    });

    console.log('Backup created:', fileUri);
    return backupData;
  } catch (error) {
    console.log('Error creating backup:', error);
    throw error;
  }
};

export const restoreFromBackup = async (): Promise<BackupData | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return null;
    }

    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: 'utf8',
    });

    const backupData: BackupData = JSON.parse(fileContent);
    
    // Validate backup data structure
    if (!backupData.items || !Array.isArray(backupData.items)) {
      throw new Error('Invalid backup file format');
    }

    console.log('Backup restored:', backupData);
    return backupData;
  } catch (error) {
    console.log('Error restoring backup:', error);
    throw error;
  }
};

// Cloud backup functions (placeholder for future implementation)
export const uploadToCloud = async (backupData: BackupData): Promise<void> => {
  try {
    // This would integrate with Google Drive, iCloud, or other cloud services
    // For now, we'll just log the action
    console.log('Cloud backup would be uploaded here:', backupData);
    
    // In production, you would:
    // 1. Authenticate with the cloud service
    // 2. Upload the backup file
    // 3. Store the backup metadata
    
    throw new Error('Cloud backup not implemented yet');
  } catch (error) {
    console.log('Error uploading to cloud:', error);
    throw error;
  }
};

export const downloadFromCloud = async (): Promise<BackupData | null> => {
  try {
    // This would download from Google Drive, iCloud, or other cloud services
    console.log('Cloud backup would be downloaded here');
    
    // In production, you would:
    // 1. Authenticate with the cloud service
    // 2. List available backups
    // 3. Download the selected backup
    // 4. Parse and return the backup data
    
    throw new Error('Cloud restore not implemented yet');
  } catch (error) {
    console.log('Error downloading from cloud:', error);
    throw error;
  }
};
