import { Alert } from 'react-native';

export default function CustomeAlert(title, message, func = () => {}) {
  return Alert.alert(
    title,
    message,
    [
      {
        text: "OK",
        onPress: func,
      },
    ],
    {
      cancelable: true,
    }
  );
}
