import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native-web";

export default function Box({boxKey, order, color, position, disabled, onBoxPress, turn}) {

  const [boxColor, setBoxColor] = useState(color);

  const flash = () => {
      setTimeout(() => {
        setBoxColor('yellow');
      }, (order-1)*1000+1000);
      setTimeout(() => {
        setBoxColor('blue');
      }, order*1000+1000)
  }
  useEffect(() => {
    if (order > 0) {
      flash();
    }
  }, [turn])
  
  useEffect(() => {
    setBoxColor(color);
  }, [color]);

  const onPress = () => {
    if (boxColor == 'yellow' || disabled) return;
    onBoxPress(boxKey, order);
  };

  return (
    <TouchableOpacity
      style={{height: position? '20%' : '100px', aspectRatio: 1, margin:'10px', backgroundColor: boxColor, position: position? 'absolute' : 'relative', top: position? position[1] : '', left: position? position[0] : ''}}
      onPress={onPress}>
      <Text>{boxKey}</Text>  
    </TouchableOpacity>
  );
};