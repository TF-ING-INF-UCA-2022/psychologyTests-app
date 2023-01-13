import { useEffect, useState } from "react";
import { Text, View } from "react-native-web";
import AppButton from "../../components/Button";
import Box from "./Box";

export default function Instructions({onStartPress, inverted}) {
  const [boxOrderToBePressed, setBoxOrderToBePressed] = useState(1);
  const [numberOfCorrects, setNumberOfCorrects] = useState(0);
  const [correct, setCorrect] = useState(false);
  const [done, setDone] = useState(false);
  const [showCross, setShowCross] = useState(false);
  const [test, setTest] = useState(false);

  useEffect(() => {
    if (numberOfCorrects == 2) {
      setDone(true);
      setCorrect(true);
    }
  }, [numberOfCorrects]);

  useEffect(() => {
    if (boxOrderToBePressed > 2 && numberOfCorrects < 2) {
      setNumberOfCorrects(0);
      setBoxOrderToBePressed(1);
      setDone(true);
      setCorrect(false);
    }
  }, [boxOrderToBePressed]);

  function onBoxPress(key, order) {
    if (boxOrderToBePressed <= 2) {
      if (boxOrderToBePressed == order) {
        console.log('OK');
        setNumberOfCorrects((prev) => prev + 1);
      }
      setBoxOrderToBePressed((prev) => prev + 1);
    }
  }
  function onBoxPressInverted(key, order) {
    if (boxOrderToBePressed <= 2) {
      if (boxOrderToBePressed == (2 - order + 1)) {
        console.log('OK');
        setNumberOfCorrects((prev) => prev + 1);
      }
      setBoxOrderToBePressed((prev) => prev + 1);
    }
  }
  function restart() {
    setTest(true);
    setDone(false);
  }
  function showCrossAndBegin() {
    setShowCross(true);
    setTimeout(() => {
      setShowCross(false);
      onStartPress();
    },3000)
  }
  return (
    !showCross?
    (<View style={{width: '100%', height: '100%', backgroundColor: 'black', padding: '2em', alignItems: 'center', justifyContent: 'space-evenly'}}>
      <Text style={{color: 'white', fontSize: '2rem'}}>Instrucciones</Text>
      <Text style={{color: 'white', fontSize: '1.5rem', textAlign: 'center'}}>Verá 9 cuadrados azules en la pantalla y se irán encendiendo en amarillo en determinado orden. Preste atención y repita el orden de la secuencia una vez que se hayan apagado. Hagamos una prueba {inverted? '(Ahora invertido)': ''}</Text>
      {!done? (test? <View style={{flexDirection: 'row'}}>
        <Box order={1} boxKey={1} color='blue' onBoxPress={inverted? onBoxPressInverted : onBoxPress}></Box>
        <Box order={2} boxKey={2} color='blue' onBoxPress={inverted? onBoxPressInverted : onBoxPress}></Box>
      </View> : <AppButton title='Hacer una prueba' onPress={restart}></AppButton>) : null}
      <Text style={{fontSize: '5rem', color: correct? 'green': 'red'}}>{done? correct? '✔' : '✕' : ''}</Text>
      {done? <AppButton title={correct? 'Comenzar' : 'Reintentar'} onPress={correct? showCrossAndBegin : restart}></AppButton> : null}
      {(done && correct)? <Text style={{color: 'white', fontSize: '1.2rem'}}>Ahora aparecerá una cruz en el centro de la pantalla. Por favor, preste atención a la cruz.</Text> : null}
    </View>) :
    (<View style={{width: '100%', height: '100%', backgroundColor: 'black', padding: '2em', alignItems: 'center', justifyContent: 'space-evenly'}}>
      <Text style={{fontSize: '10rem', color: 'white'}}>✕</Text>
    </View>)
  );
}