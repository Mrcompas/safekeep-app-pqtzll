
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export interface CameraResult {
  success: boolean;
  imageUri?: string;
  error?: string;
}

export const requestCameraPermissions = async (): Promise<boolean> => {
  try {
    console.log('Requesting camera permissions...');
    
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    const hasPermissions = cameraPermission.status === 'granted' && 
                          mediaLibraryPermission.status === 'granted';
    
    console.log('Camera permissions granted:', hasPermissions);
    return hasPermissions;
  } catch (error) {
    console.error('Error requesting camera permissions:', error);
    return false;
  }
};

export const takePhoto = async (): Promise<CameraResult> => {
  try {
    // Check permissions first
    const hasPermissions = await requestCameraPermissions();
    if (!hasPermissions) {
      return {
        success: false,
        error: 'Camera permissions are required to take photos'
      };
    }

    console.log('Opening camera...');
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (result.canceled) {
      console.log('Camera was canceled');
      return { success: false, error: 'Photo capture was canceled' };
    }

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('Photo taken successfully:', imageUri);
      return { success: true, imageUri };
    }

    return { success: false, error: 'No photo was captured' };
  } catch (error) {
    console.error('Error taking photo:', error);
    return { 
      success: false, 
      error: 'An error occurred while taking the photo' 
    };
  }
};

export const pickImageFromLibrary = async (): Promise<CameraResult> => {
  try {
    // Check permissions first
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (mediaLibraryPermission.status !== 'granted') {
      return {
        success: false,
        error: 'Media library permissions are required to select photos'
      };
    }

    console.log('Opening image library...');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      exif: false,
    });

    if (result.canceled) {
      console.log('Image selection was canceled');
      return { success: false, error: 'Image selection was canceled' };
    }

    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('Image selected successfully:', imageUri);
      return { success: true, imageUri };
    }

    return { success: false, error: 'No image was selected' };
  } catch (error) {
    console.error('Error selecting image:', error);
    return { 
      success: false, 
      error: 'An error occurred while selecting the image' 
    };
  }
};

export const showImagePickerOptions = (): Promise<CameraResult> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Add Receipt Photo',
      'Choose how you want to add a receipt photo',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const result = await takePhoto();
            resolve(result);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const result = await pickImageFromLibrary();
            resolve(result);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve({ success: false, error: 'Canceled' }),
        },
      ]
    );
  });
};
