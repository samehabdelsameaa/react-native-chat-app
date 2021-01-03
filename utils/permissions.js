import * as ImagePicker from 'expo-image-picker';

export const requestImagePermission = async () => {
    try {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!result.granted)
            return alert("You need To enable the Image permissions")
        
    } catch (error) {
        console.log(' can not permit image library');
    }
}